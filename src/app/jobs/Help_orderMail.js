import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class Help_orderMail {
  get key() {
    return 'Help_orderMail';
  }

  async handle({ data }) {
    const { student, question, answer, answer_at } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Gympoint: Dúvida Respondida!',
      template: 'help_order',
      context: {
        question,
        student: student.name,
        answer_at: format(parseISO(answer_at), "dd ' de 'MMMM', às ' H:mm", {
          locale: pt,
        }),
        answer,
      },
    });
  }
}

export default new Help_orderMail();
