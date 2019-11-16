import { format, parseISO } from 'date-fns';
import Mail from '../../lib/Mail';

class RegistrationMail {
  get key() {
    return 'RegistrationMail';
  }

  async handle({ data }) {
    const { checkStudentExists, registration, plan } = data;

    console.log(plan);

    await Mail.sendMail({
      to: `${checkStudentExists.name} <${checkStudentExists.email}>`,
      subject: 'Boas Vindas Gympoint',
      template: 'registration',
      context: {
        plan_name: plan.title,
        student: checkStudentExists.name,
        date: format(parseISO(registration.end_date), "MMMM dd ', at ' H:mm"),
        price: registration.price,
      },
    });
  }
}

export default new RegistrationMail();
