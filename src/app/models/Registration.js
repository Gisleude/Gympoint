import Sequelize, { Model } from 'sequelize';
import { parseISO, addMonths } from 'date-fns';
import Plan from './Plan';

class Registration extends Model {
  static init(sequelize) {
    super.init(
      {
        student_id: Sequelize.NUMBER,
        plan_id: Sequelize.NUMBER,
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
        price: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeUpdate', async registration => {
      const plan = await Plan.findOne({ where: { id: this.plan_id } });

      const start_date_formatted = parseISO(this.start_date);

      registration.end_date = addMonths(start_date_formatted, plan.duration);

      registration.price = plan.duration * plan.price;
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'student_id', as: 'student' });
    this.belongsTo(models.User, { foreignKey: 'plan_id', as: 'plan' });
  }
}

export default Registration;
