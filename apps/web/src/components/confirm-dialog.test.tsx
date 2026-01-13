import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConfirmDialog from './confirm-dialog';

const createProps = (overrides?: Partial<React.ComponentProps<typeof ConfirmDialog>>) => {
  return {
    open: true,
    title: '삭제 확인',
    message: '정말 삭제하시겠습니까?',
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
    ...overrides,
  };
};

describe('ConfirmDialog', () => {
  it('open이 true일 때 다이얼로그가 표시되어야 함', () => {
    render(<ConfirmDialog {...createProps()} />);

    expect(screen.getByText('삭제 확인')).toBeInTheDocument();
    expect(screen.getByText('정말 삭제하시겠습니까?')).toBeInTheDocument();
  });

  it('open이 false일 때 다이얼로그가 표시되지 않아야 함', () => {
    render(<ConfirmDialog {...createProps({ open: false })} />);

    expect(screen.queryByText('삭제 확인')).not.toBeInTheDocument();
  });

  it('title이 올바르게 렌더링되어야 함', () => {
    render(<ConfirmDialog {...createProps({ title: '제목 변경' })} />);

    expect(screen.getByText('제목 변경')).toBeInTheDocument();
  });

  it('message가 올바르게 렌더링되어야 함', () => {
    render(<ConfirmDialog {...createProps({ message: '메시지 변경' })} />);

    expect(screen.getByText('메시지 변경')).toBeInTheDocument();
  });

  it('확인 버튼 클릭 시 onConfirm 핸들러가 호출되어야 함', async () => {
    const user = userEvent.setup();
    const props = createProps();

    render(<ConfirmDialog {...props} />);

    const confirmButton = screen.getByRole('button', { name: '확인' });
    await user.click(confirmButton);

    expect(props.onConfirm).toHaveBeenCalledTimes(1);
  });

  it('취소 버튼 클릭 시 onCancel 핸들러가 호출되어야 함', async () => {
    const user = userEvent.setup();
    const props = createProps();

    render(<ConfirmDialog {...props} />);

    const cancelButton = screen.getByRole('button', { name: '취소' });
    await user.click(cancelButton);

    expect(props.onCancel).toHaveBeenCalledTimes(1);
  });

  it('onConfirm과 onCancel이 각각 한 번씩 호출되어야 함', async () => {
    const user = userEvent.setup();
    const props = createProps();

    render(<ConfirmDialog {...props} />);

    const cancelButton = screen.getByRole('button', { name: '취소' });
    const confirmButton = screen.getByRole('button', { name: '확인' });

    await user.click(cancelButton);
    await user.click(confirmButton);

    expect(props.onCancel).toHaveBeenCalledTimes(1);
    expect(props.onConfirm).toHaveBeenCalledTimes(1);
  });
});
