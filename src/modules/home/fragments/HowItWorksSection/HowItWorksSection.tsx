import { STEPS } from '../../constants/howItWorks';
import SectionHeading from '../SectionHeading/SectionHeading';
import { Number, Step, StepText, StepTitle, Steps, Wrapper } from './styles';

const HowItWorksSection = () => (
  <Wrapper id="como-funciona">
    <SectionHeading
      eyebrow="Como funciona"
      title="Preparação prática para a 2ª fase"
      description="Você treina no formato do exame e aprende com a comparação entre sua resposta e o espelho."
    />
    <Steps>
      {STEPS.map((step, index) => (
        <Step key={step.title}>
          <Number aria-hidden>{index + 1}</Number>
          <StepTitle level={3}>{step.title}</StepTitle>
          <StepText>{step.text}</StepText>
        </Step>
      ))}
    </Steps>
  </Wrapper>
);

export default HowItWorksSection;
