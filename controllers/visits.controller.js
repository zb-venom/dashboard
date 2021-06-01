const Visits = require("../models/Visits");

exports.getVisits = async (req, res) => {
  let data = [];
  let temp;
  switch (req.params.type) {
    case "number_of_guests_per_city":
      data = await Visits.aggregate([
        {
          $group: {
            _id: "$city",
            number_of_guests: { $sum: "$guest_count" },
          },
        },
        {
          $project: {
            _id: 0,
            city: "$_id",
            number_of_guests: "$number_of_guests",
          },
        },
      ]);
      break;
    case "average_visit_summary_per_city":
      data = await Visits.aggregate([
        {
          $group: {
            _id: "$city",
            average_visit_summary: { $avg: "$visit_sum" },
          },
        },
        {
          $project: {
            _id: 0,
            city: "$_id",
            average_visit_summary: "$average_visit_summary",
          },
        },
      ]);
      break;
    case "visit_summary_per_city":
      data = await Visits.aggregate([
        {
          $group: {
            _id: "$city",
            visit_summary: { $sum: "$visit_sum" },
          },
        },
        {
          $project: {
            _id: 0,
            guest_id: "$_id",
            visit_summary: "$visit_summary",
          },
        },
      ]);
      break;
    case "visit_summary_per_guest":
      data = await Visits.aggregate([
        {
          $group: {
            _id: "$guest_id",
            visit_summary: { $sum: "$visit_sum" },
          },
        },
        {
          $project: {
            _id: 0,
            guest_id: "$_id",
            visit_summary: "$visit_summary",
          },
        },
      ]);
      break;
  }
  res.json({
    data,
  });
};

exports.addVisits = async (req, res) => {
  let temp = req.body.data;
  temp = temp.split(",");
  let data = [];
  for (let i = 0; i < temp.length; i += 6) {
    let t = {
      date: temp[i + 1],
      city: temp[i + 2],
      guest_count: temp[i + 3],
      visit_sum: temp[i + 4],
      guest_id: temp[i + 5],
    };
    data.push(t);
    // let visits = new Visits(t);
    // visits.save();
  }
  res.json({ data });
};
