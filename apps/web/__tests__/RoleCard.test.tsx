import { render, screen, fireEvent } from '@testing-library/react';
import RoleCard from '@/components/RoleCard';

describe('RoleCard', () => {
  it('renders title and description', () => {
    render(<RoleCard title="Tutor" description="Patient guidance" selected={false} onClick={() => {}} />);
    expect(screen.getByText('Tutor')).toBeInTheDocument();
    expect(screen.getByText('Patient guidance')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<RoleCard title="Tutor" description="Patient guidance" selected={false} onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('has border-white class when selected', () => {
    render(<RoleCard title="Tutor" description="Patient guidance" selected={true} onClick={() => {}} />);
    expect(screen.getByRole('button').className).toContain('border-white');
  });

  it('does not have border-white class when not selected', () => {
    render(<RoleCard title="Tutor" description="Patient guidance" selected={false} onClick={() => {}} />);
    expect(screen.getByRole('button').className).not.toContain('border-white');
  });
});
