import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FloatingButton from './floating-button';

describe('FloatingButton', () => {
  it('Fab 컴포넌트가 렌더링되어야 함', () => {
    render(<FloatingButton onClick={vi.fn()} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('고정된 위치를 가져야 함 (bottom: 16, right: 16)', () => {
    render(<FloatingButton onClick={vi.fn()} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveStyle({
      position: 'fixed',
      bottom: '16px',
      right: '16px',
    });
  });

  it('클릭 시 onClick 핸들러가 호출되어야 함', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    
    render(<FloatingButton onClick={handleClick} />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('기본 aria-label이 설정되어야 함', () => {
    render(<FloatingButton onClick={vi.fn()} />);
    
    const button = screen.getByRole('button', { name: '새 일정 만들기' });
    expect(button).toBeInTheDocument();
  });

  it('커스텀 label이 제공되면 해당 값이 aria-label로 설정되어야 함', () => {
    render(<FloatingButton onClick={vi.fn()} label="새 항목 추가" />);
    
    const button = screen.getByRole('button', { name: '새 항목 추가' });
    expect(button).toBeInTheDocument();
  });

  it('AddIcon이 렌더링되어야 함', () => {
    render(<FloatingButton onClick={vi.fn()} />);
    
    const icon = document.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });
});
