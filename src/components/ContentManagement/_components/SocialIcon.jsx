import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaPinterest,
  FaTiktok,
  FaSnapchat,
  FaWhatsapp,
  FaTelegram,
  FaGithub,
  FaDiscord
} from 'react-icons/fa';

const SocialIcon = ({ icon, className = "" }) => {
  const iconMap = {
    FaFacebookF: FaFacebookF,
    FaTwitter: FaTwitter,
    FaInstagram: FaInstagram,
    FaLinkedin: FaLinkedin,
    FaYoutube: FaYoutube,
    FaPinterest: FaPinterest,
    FaTiktok: FaTiktok,
    FaSnapchat: FaSnapchat,
    FaWhatsapp: FaWhatsapp,
    FaTelegram: FaTelegram,
    FaGithub: FaGithub,
    FaDiscord: FaDiscord
  };

  const IconComponent = iconMap[icon];

  if (!IconComponent) {
    return <span className={className}>❓</span>; // Fallback icon
  }

  return <IconComponent className={className} />;
};

export default SocialIcon;
