import * as Yup from 'yup';
import Plan from '../models/Plan';

class PlanController {
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { title, duration, price } = req.body;

    const checkTitle = await Plan.findOne({ where: { title } });

    if (checkTitle) {
      return res
        .status(400)
        .json({ error: 'Already exists a Plan with this title' });
    }

    const plan = await Plan.create({
      title,
      duration,
      price,
    });

    return res.json(plan);
  }

  async index(req, res) {
    const plans = await Plan.findAll({
      attributes: ['id', 'title', 'duration', 'price'],
    });
    return res.json(plans);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
      title: Yup.string(),
      duration: Yup.number(),
      price: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { title } = req.body;
    const { id } = req.params;

    const plan = await Plan.findOne({ where: { id } });

    if (!plan) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const planExists = await Plan.findOne({ where: { title } });

    if (planExists) {
      return res
        .status(400)
        .json({ error: 'Already exists a Plan with this title' });
    }

    const { duration, price } = await plan.update(req.body);

    return res.json({
      id,
      title,
      duration,
      price,
    });
  }

  async delete(req, res) {
    const plan = await Plan.findByPk(req.params.id);

    if (!plan) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    await Plan.destroy({ where: { id: plan.id } });

    return res
      .status(200)
      .json({ success: `Plan ${plan.id} deleted with success` });
  }
}

export default new PlanController();
