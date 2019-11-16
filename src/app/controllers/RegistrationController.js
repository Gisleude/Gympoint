import * as Yup from 'yup';
import { parseISO, addMonths } from 'date-fns';
import Student from '../models/Student';
import Plan from '../models/Plan';
import Registration from '../models/Registration';

import RegistrationMail from '../jobs/RegistrationMail';
import Queue from '../../lib/Queue';

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

    await Queue.add(RegistrationMail.key, {
      checkStudentExists,
      registration,
      plan,
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
      student_id: Yup.number(),
      plan_id: Yup.number(),
      start_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { student_id, plan_id, start_date } = req.body;

    const { id } = req.params;

    const checkIdExists = await Registration.findByPk(id);

    if (!checkIdExists) {
      return res.status(400).json({ error: 'Id does not found' });
    }

    if (student_id) {
      const checkStudentExists = await Student.findOne({
        where: { id: student_id },
      });

      if (!checkStudentExists) {
        return res.status(400).json({ error: 'Student does not found' });
      }

      const checkStudentHasRegistration = await Registration.findOne({
        where: { student_id },
      });

      // eslint-disable-next-line eqeqeq
      if (checkStudentHasRegistration && checkStudentHasRegistration.id != id) {
        return res
          .status(400)
          .json({ error: 'Student already has a Registration' });
      }
    }

    if (plan_id) {
      const checkPlanExists = await Plan.findOne({
        where: { id: plan_id },
      });

      if (!checkPlanExists) {
        return res.status(400).json({ error: 'Plan does not found' });
      }
    }

    const plan = await Plan.findOne({ where: { id: plan_id } });

    const start_date_formatted = parseISO(start_date);

    const end_date = addMonths(start_date_formatted, plan.duration);

    const price = plan.duration * plan.price;

    const registration = await checkIdExists.update({
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
    });

    return res.json(registration);
  }

  async delete(req, res) {
    const { id } = req.params;

    const checkIdExists = await Registration.findByPk(id);

    if (!checkIdExists) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    await Registration.destroy({ where: { id } });

    return res
      .status(200)
      .json({ success: `Registration ${id} deleted with success` });
  }
}

export default new RegistrationController();
