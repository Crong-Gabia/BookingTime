import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StickyActionBar from './sticky-action-bar';

describe('StickyActionBar', () => {
  it('하단에 고정된 위치를 가져야 함', () => {
    render(
      <StickyActionBar
        label="확인"
        onClick={vi.fn()}
      />,
    );
    
    const actionBar = screen.getByRole('button').parentElement;
    expect(actionBar).toHaveStyle({
      position: 'fixed',
      bottom: '0px',
      left: '0px',
      right: '0px',
    });
  });

  it('label이 표시되어야 함', () => {
    render(
      <StickyActionBar
        label="다음 단계"
        onClick={vi.fn()}
      />,
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('다음 단계');
  });

  it('disabled 상태일 때 버튼이 비활성화되어야 함', () => {
    render(
      <StickyActionBar
        label="확인"
        disabled={true}
        onClick={vi.fn()}
      />,
    );
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('disabled가 false일 때 버튼이 활성화되어야 함', () => {
    render(
      <StickyActionBar
        label="확인"
        disabled={false}
        onClick={vi.fn()}
      />,
    );
    
    const button = screen.getByRole('button');
    expect(button).not.toBeDisabled();
  });

  it('selectedCount가 0이면 개수가 표시되지 않아야 함', () => {
    render(
      <StickyActionBar
        label="확인"
        onClick={vi.fn()}
        selectedCount={0}
      />,
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('확인');
    expect(button).not.toHaveTextContent('(0개 선택)');
  });

  it('selectedCount가 양수이면 개수가 표시되어야 함', () => {
    render(
      <StickyActionBar
        label="확인"
        onClick={vi.fn()}
        selectedCount={3}
      />,
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('확인 (3개 선택)');
  });

  it('클릭 시 onClick 핸들러가 호출되어야 함', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    
    render(
      <StickyActionBar
        label="확인"
        onClick={handleClick}
      />,
    );
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
