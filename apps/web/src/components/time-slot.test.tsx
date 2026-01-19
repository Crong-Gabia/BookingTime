import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import TimeSlot from './time-slot';

const theme = createTheme({
  palette: {
    success: {
      main: '#0D9488',
      light: '#2DD4BF',
      dark: '#0F766E',
    },
    error: {
      main: '#E11D48',
      light: '#FB7185',
      dark: '#BE123C',
    },
    action: {
      disabledBackground: 'rgba(0, 0, 0, 0.04)',
    },
    text: {
      primary: '#0F172A',
      disabled: '#94A3B8',
    },
    background: {
      paper: '#FFFFFF',
    },
    divider: '#E2E8F0',
  },
});

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe('TimeSlot', () => {
  it('가능 상태를 올바른 스타일로 렌더링해야 함', () => {
    renderWithTheme(<TimeSlot time="09:00" status="available" onClick={vi.fn()} />);

    const slot = screen.getByText('09:00');
    expect(slot).toBeInTheDocument();
    expect(slot.closest('button')).toHaveStyle({
      backgroundColor: theme.palette.success.light,
      color: theme.palette.success.dark,
      border: `2px solid ${theme.palette.success.main}`,
    });
  });

  it('불가 상태를 올바른 스타일로 렌더링해야 함', () => {
    renderWithTheme(<TimeSlot time="09:30" status="unavailable" onClick={vi.fn()} />);

    const slot = screen.getByText('09:30');
    expect(slot).toBeInTheDocument();
    expect(slot.closest('button')).toHaveStyle({
      backgroundColor: theme.palette.error.light,
      color: theme.palette.error.dark,
      border: `2px solid ${theme.palette.error.main}`,
    });
  });

  it('차단 상태를 올바르게 렌더링해야 함', () => {
    renderWithTheme(
      <TimeSlot
        time="10:00"
        status="blocked"
        onClick={vi.fn()}
        blockedReason="점심시간"
      />,
    );

    const slot = screen.getByText('10:00');
    const button = slot.closest('button');

    expect(button).not.toBeNull();
    expect(button).toBeDisabled();
    expect(button).toHaveStyle({ opacity: '0.5' });
    expect(screen.getByText('점심시간')).toBeInTheDocument();
  });

  it('가능/불가 상태에서 클릭 시 onClick 핸들러를 호출해야 함', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    renderWithTheme(<TimeSlot time="09:00" status="available" onClick={handleClick} />);

    const slot = screen.getByText('09:00');
    await user.click(slot);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('차단 상태에서는 클릭이 작동하지 않아야 함', () => {
    const handleClick = vi.fn();

    renderWithTheme(<TimeSlot time="10:00" status="blocked" onClick={handleClick} />);

    const button = screen.getByRole('button', { name: /10:00/ });
    fireEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });
});
