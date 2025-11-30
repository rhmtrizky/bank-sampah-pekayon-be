import prisma from "../config/database.js";

export async function createDepositRequest({
  user_id,
  rw_id,
  photoUrl,
  items,
}) {
  return prisma.$transaction(async (tx) => {
    const request = await tx.deposit_requests.create({
      data: {
        user_id,
        rw_id,
        photo: photoUrl ?? null,
      },
    });

    if (items?.length) {
      await tx.deposit_request_items.createMany({
        data: items.map((i) => ({
          request_id: request.request_id,
          waste_type_id: i.waste_type_id,
          weight_kg: i.weight_kg,
        })),
      });
    }

    return request;
  });
}

export const DepositRequestsRepo = {
  create: async ({ user_id, rw_id, photo, items }) => {
    return prisma.$transaction(async (tx) => {
      const request = await tx.deposit_requests.create({
        data: { user_id, rw_id, photo: photo ?? null },
      });
      if (items?.length) {
        await tx.deposit_request_items.createMany({
          data: items.map((i) => ({
            request_id: request.request_id,
            waste_type_id: i.waste_type_id,
            weight_kg: i.weight_kg,
          })),
        });
      }
      return request;
    });
  },
  findById: (request_id) =>
    prisma.deposit_requests.findUnique({ where: { request_id } }),
  findDetailById: (request_id) =>
    prisma.deposit_requests.findUnique({
      where: { request_id },
      include: {
        user: true,
        rw_list: true,
        items: {
          include: {
            waste_type: true,
          },
        },
      },
    }),
  listMine: (user_id) =>
    prisma.deposit_requests.findMany({
      where: { user_id },
      orderBy: { created_at: "desc" },
    }),
  update: (request_id, data) =>
    prisma.deposit_requests.update({ where: { request_id }, data }),
  bulkScheduleByDateRange: (rw_id, from_date, to_date, scheduled_date) =>
    prisma.deposit_requests.updateMany({
      where: {
        rw_id,
        status: "pending",
        created_at: {
          gte: new Date(from_date),
          lte: new Date(to_date),
        },
      },
      data: {
        status: "scheduled",
        scheduled_date: new Date(scheduled_date),
      },
    }),
};
