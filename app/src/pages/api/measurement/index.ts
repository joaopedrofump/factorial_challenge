import type { NextApiRequest, NextApiResponse } from "next";

import { singletonMeasureService } from "src/server/service/measure-service";

export default async (req: NextApiRequest, res: NextApiResponse) => {

  if (req.method === "GET") {

    try {
      const result = await singletonMeasureService.getMeasurements();
      res.status(200).json(result );
    } catch (err) {
      res.status(400).json({ status: { error: err } });
    }

    return;
    
  } 

  res.status(405).json({ status: { error: true } });

};
