import { message, Modal } from 'antd';
import { useState } from 'react';
import { CaseHasAttemptsError, deleteCase, setCaseActive, type CaseSummary } from '../api/cases';

/** Activate/deactivate and delete, with confirmation and feedback. `onChanged` reloads the list. */
export const useCaseActions = (onChanged: () => void) => {
  const [modal, modalHolder] = Modal.useModal();
  const [messages, messageHolder] = message.useMessage();
  const [busyId, setBusyId] = useState<string | null>(null);

  const run = async (caseId: string, action: () => Promise<void>, success: string) => {
    setBusyId(caseId);
    try {
      await action();
      void messages.success(success);
      onChanged();
    } catch (error) {
      void messages.error(
        error instanceof CaseHasAttemptsError
          ? 'Este caso já tem tentativas de estudantes. Desative-o em vez de excluir.'
          : 'Não foi possível concluir a ação. Tente novamente.',
      );
    } finally {
      setBusyId(null);
    }
  };

  const toggleActive = async (caseStudy: CaseSummary) => {
    if (caseStudy.isActive) {
      const confirmed = await modal.confirm({
        title: 'Desativar caso?',
        content:
          'Ele deixa de ser sorteado nos treinos. Quem já o resolveu continua vendo no histórico.',
        okText: 'Desativar',
        cancelText: 'Cancelar',
      });
      if (!confirmed) return;
    }

    await run(
      caseStudy.id,
      () => setCaseActive(caseStudy.id, !caseStudy.isActive),
      caseStudy.isActive ? 'Caso desativado.' : 'Caso ativado.',
    );
  };

  const remove = async (caseStudy: CaseSummary) => {
    const confirmed = await modal.confirm({
      title: 'Excluir caso?',
      content: `"${caseStudy.title}" e o gabarito serão excluídos. Esta ação não pode ser desfeita.`,
      okText: 'Excluir',
      okButtonProps: { danger: true },
      cancelText: 'Cancelar',
    });
    if (!confirmed) return;

    await run(caseStudy.id, () => deleteCase(caseStudy.id), 'Caso excluído.');
  };

  return {
    busyId,
    toggleActive,
    remove,
    holders: (
      <>
        {modalHolder}
        {messageHolder}
      </>
    ),
  };
};
