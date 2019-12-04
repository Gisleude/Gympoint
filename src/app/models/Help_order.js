import { Sequelize, Model } from 'sequelize';

class Help_order extends Model {
  static init(sequelize) {
    super.init(
      {
        student_id: Sequelize.NUMBER,
        question: Sequelize.STRING,
        answer: Sequelize.STRING,
        answer_at: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default Help_order;
