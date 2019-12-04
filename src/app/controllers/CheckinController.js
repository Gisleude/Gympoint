import { subDays } from 'date-fns';
import Checkin from '../models/Checkin';
import Student from '../models/Student';

class CheckinController {
  async store(req, res) {
    const { id } = req.params;

    const checkIdExists = await Student.findByPk(id);

    if (!checkIdExists) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const checkinTimes = await Checkin.findAll({ where: { student_id: id } });

    var checkinCount = 0;
    for (const value of checkinTimes) {
      if(value.createdAt > subDays(Date.now(),7)){
        checkinCount++;
      }
    }

    if(checkinCount > 4 ){
      return res.status(400).json({ error: 'You just can use the gym 5 times in 7 days.'})
    }

    const checkin = await Checkin.create({
      student_id: id,
    });

    return res.json(checkin);
  }

  async index(req, res) {
    const { id } = req.params;

    const checkins = await Checkin.findAll({
      where: { student_id: id }
    });
    return res.json(checkins);
  }
}

export default new CheckinController();
