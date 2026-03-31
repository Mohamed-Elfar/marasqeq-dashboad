import logo from '@/assets/images/logo/logo.svg';
import Image from 'next/image';
import Link from 'next/link';
const LogoBox = () => {
  return <div className="logo-box">
      <Link href="/content-management/pages/home" className="logo-dark brand-link">
        <Image width={36} height={36} src={logo} className="logo-lg brand-logo" alt="Maraseq Logo" />
        <span className="brand-name">Maraseq</span>
      </Link>
      <Link href="/content-management/pages/home" className="logo-light brand-link">
        <Image width={36} height={36} src={logo} className="logo-lg brand-logo" alt="Maraseq Logo" />
        <span className="brand-name">Maraseq</span>
      </Link>
    </div>;
};
export default LogoBox;