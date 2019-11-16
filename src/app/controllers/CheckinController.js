import { parseISO, addMonths } from 'date-fns';
import Checkin from '../models/Checkin';
import Student from '../models/Student';

class CheckinController {
  async store(req, res) {
    const { id } = req.params;

    const checkIdExists = await Student.findByPk(id);

    if (!checkIdExists) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    // const checkinTimes = await Checkin.findAll({ where: { student_id: id } });

    const checkin = await Checkin.create({
      student_id: id,
    });

    return res.json(checkin);
  }

  async index(req, res) {
    return res.json({});
  }
}

export default new CheckinController();
