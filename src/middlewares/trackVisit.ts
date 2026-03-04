import { Request, Response, NextFunction } from "express";
import Visit from "../models/Visit";
import geoip from "geoip-lite";

export const trackVisit = (req: Request, res: Response, next: NextFunction) => {
  let clientIp: string | undefined;

  // 1️⃣ Extract IP safely
  const forwarded = req.headers["x-forwarded-for"];

  if (Array.isArray(forwarded)) {
    clientIp = forwarded[0];
  } else if (typeof forwarded === "string") {
    clientIp = forwarded.split(",")[0].trim();
  } else if (req.socket.remoteAddress) {
    clientIp = req.socket.remoteAddress;
  }

  if (!clientIp) {
    next();
    return;
  }

  // 2️⃣ Geo lookup
  let visitorCountry = "Unknown";
  const geo = geoip.lookup(clientIp);

  if (geo?.country) {
    visitorCountry = geo.country;
  }

  // 3️⃣ Save visit
  Visit.findOneAndUpdate(
    { ip: clientIp },
    {
      $set: {
        lastVisit: new Date(),
        country: visitorCountry,
      },
      $inc: { visitCount: 1 },
    },
    { upsert: true },
  ).catch((err) => console.error("IP Tracking Error:", err));

  next();
};
