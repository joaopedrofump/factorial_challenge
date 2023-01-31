import type { NextApiRequest, NextApiResponse } from "next";

import { singletonMeasureService } from "src/server/service/measure-service";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const measure = req.query.name as string;

  if (req.method === "GET") {
    try {
      const result = await singletonMeasureService.getMeasurement(measure);

      res.status(200).json(result);
    } catch (err) {
      res.status(400).json({ status: { error: err } });
    }
  } else if (req.method === "POST") {
    const { value } = req.body;

    if (typeof value === "undefined") {
      res
        .status(400)
        .json({ status: { error: "Please pass the value to save" } });
      return;
    }

    try {
      await singletonMeasureService.saveMeasure(measure, value);
      res.status(200).json({ status: { error: false } });
    } catch (err) {
      res.status(400).json({ status: { error: err } });
    }
  }
};
