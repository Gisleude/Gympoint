import * as Yup from 'yup';
import { parseISO, addMonths } from 'date-fns';
import Student from '../models/Student';
import Plan from '../models/Plan';
import Registration from '../models/Registration';

class RegistrationController {
  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { student_id, plan_id, start_date } = req.body;

    const checkStudentExists = await Student.findOne({
      where: { id: student_id },
    });

    if (!checkStudentExists) {
      return res.status(400).json({ error: 'Student does not exists' });
    }

    const checkStudentHasRegistration = await Registration.findOne({
      where: { student_id },
    });

    if (checkStudentHasRegistration) {
      return res
        .status(400)
        .json({ error: 'Student already has a registration' });
    }

    const checkPlanExists = await Plan.findOne({ where: { id: plan_id } });

    if (!checkPlanExists) {
      return res.status(400).json({ error: 'Plan does not exists' });
    }

    const plan = await Plan.findOne({ where: { id: plan_id } });

    const start_date_formatted = parseISO(start_date);

    const end_date = addMonths(start_date_formatted, plan.duration);

    const price = plan.duration * plan.price;

    const registration = await Registration.create({
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
    });

    return res.json(registration);
  }

  async index(req, res) {
    const registrations = await Registration.findAll({
      attributes: [
        'id',
        'student_id',
        'plan_id',
        'start_date',
        'end_date',
        'price',
      ],
    });
    return res.json(registrations);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
      student_id: Yup.number(),
      plan_id: Yup.number(),
      start_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id, student_id, plan_id } = req.body;

    const registration = await Registration.findOne({
      where: { id },
    });

    if (!registration) {
      res.status(400).json({ error: 'Registration does not exists' });
    }

    const checkStudentExists = await Student.findOne({
      where: { id: student_id },
    });

    if (!checkStudentExists) {
      return res.status(400).json({ error: 'Student does not exists' });
    }

    const checkStudentHasRegistration = await Registration.findOne({
      where: { student_id },
    });

    if (checkStudentHasRegistration) {
      return res
        .status(400)
        .json({ error: 'Student already has a registration' });
    }

    const checkPlanExists = await Plan.findOne({ where: { id: plan_id } });

    if (!checkPlanExists) {
      return res.status(400).json({ error: 'Plan does not exists' });
    }

    const updateRegistration = await registration.update(req.body);

    return res.json(updateRegistration);
  }
}

export default new RegistrationController();
