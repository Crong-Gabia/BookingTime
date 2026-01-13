import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConfirmDialog from './confirm-dialog';

describe('ConfirmDialog', () => {
  const defaultProps = {
    open: true,
    title: '삭제 확인',
    message: '정말 삭제하시겠습니까?',
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
  };

  it('open이 true일 때 다이얼로그가 표시되어야 함', () => {
    render(<ConfirmDialog {...defaultProps} />);
    
    expect(screen.getByText('삭제 확인')).toBeInTheDocument();
    expect(screen.getByText('정말 삭제하시겠습니까?')).toBeInTheDocument();
  });

  it('open이 false일 때 다이얼로그가 표시되지 않아야 함', () => {
    render(<ConfirmDialog {...defaultProps} open={false} />);
    
    expect(screen.queryByText('삭제 확인')).not.toBeInTheDocument();
  });

  it('title이 올바르게 렌더링되어야 함', () => {
    render(<ConfirmDialog {...defaultProps} title="제목 변경" />);
    
    expect(screen.getByText('제목 변경')).toBeInTheDocument();
  });

  it('message가 올바르게 렌더링되어야 함', () => {
    render(<ConfirmDialog {...defaultProps} message="메시지 변경" />);
    
    expect(screen.getByText('메시지 변경')).toBeInTheDocument();
  });

  it('확인 버튼 클릭 시 onConfirm 핸들러가 호출되어야 함', async () => {
    const user = userEvent.setup();
    render(<ConfirmDialog {...defaultProps} />);
    
    const confirmButton = screen.getByRole('button', { name: '확인' });
    await user.click(confirmButton);
    
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  it('취소 버튼 클릭 시 onCancel 핸들러가 호출되어야 함', async () => {
    const user = userEvent.setup();
    render(<ConfirmDialog {...defaultProps} />);
    
    const cancelButton = screen.getByRole('button', { name: '취소' });
    await user.click(cancelButton);
    
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it('onConfirm과 onCancel이 각각 한 번씩 호출되어야 함', async () => {
    const user = userEvent.setup();
    render(<ConfirmDialog {...defaultProps} />);
    
    const cancelButton = screen.getByRole('button', { name: '취소' });
    const confirmButton = screen.getByRole('button', { name: '확인' });
    
    await user.click(cancelButton);
    await user.click(confirmButton);
    
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });
});
