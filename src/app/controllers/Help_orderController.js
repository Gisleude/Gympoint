import * as Yup from 'yup';
import { format } from 'date-fns';
import Student from '../models/Student';
import Help_order from '../models/Help_order';

import Help_orderMail from '../jobs/Help_orderMail';
import Queue from '../../lib/Queue';

class Help_orderController {
  async store(req, res) {
    const { id } = req.params;

    const checkIdExists = await Student.findByPk(id);

    if (!checkIdExists) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { question } = req.body;

    const help_order = await Help_order.create({
      student_id: id,
      question,
    });

    return res.json(help_order);
  }

  async index(req, res) {
    const { id } = req.params;

    const checkIdExists = await Student.findByPk(id);

    if (!checkIdExists) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const help_orders = await Help_order.findAll({
      where: { student_id: id },
    });

    return res.json(help_orders);
  }

  async update(req, res) {
    const { id } = req.params;

    const checkIdExists = await Help_order.findByPk(id);

    if (!checkIdExists) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { answer } = req.body;

    const answer_at = Date.now();

    const answer_at_formatted = format(answer_at, "yyyy-MM-dd'T'hh:mm:ss");

    const help_order = checkIdExists;

    const { student_id, question } = await help_order.update({
      answer,
      answer_at: answer_at_formatted,
    });

    const student = await Student.findByPk(student_id);

    console.log(student.name);

    await Queue.add(Help_orderMail.key, {
      student,
      question,
      answer,
      answer_at: answer_at_formatted,
    });

    return res.json({ id, student_id, question, answer, answer_at_formatted });
  }
}

export default new Help_orderController();
