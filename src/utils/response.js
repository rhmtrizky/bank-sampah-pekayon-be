export function ok(res, data = null, message = "OK") {
  return res.json({ status: "success", message, data });
}

export function created(res, data = null, message = "Created") {
  return res.status(201).json({ status: "success", message, data });
}
