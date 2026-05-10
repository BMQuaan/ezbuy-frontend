import { FaFacebook, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { CiLocationOn, CiMail } from "react-icons/ci";
import { FaPhoneAlt, FaEnvelopeOpenText } from "react-icons/fa";

interface ContactItemProps {
  icon: React.ReactElement;
  title: string;
  content: string;
  link?: string;
  isLink?: boolean;
}

const ContactItem: React.FC<ContactItemProps> = ({
  icon,
  title,
  content,
  link,
  isLink = false,
}) => (
  <div className="flex items-start p-4 bg-white rounded-xl shadow-md border border-border transition hover:shadow-lg">
    <div className="flex-shrink-0 text-primary mt-1">
      {icon}
    </div>
    <div className="ml-4">
      <h3 className="text-lg font-semibold text-primary-700 mb-1">{title}</h3>
      {isLink ? (
        <a
          href={link}
          className="text-foreground hover:text-primary-700 font-medium underline-offset-4"
          target="_blank"
          rel="noopener noreferrer"
        >
          {content}
        </a>
      ) : (
        <p className="text-foreground font-medium">{content}</p>
      )}
    </div>
  </div>
);

export default function ContactPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-primary-700 mb-3">
          Contact EZBuy
        </h1>
        <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
          We’re always ready to assist you 24/7. Below are EZBuy’s official and fastest contact channels.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* BLOCK 1: Hotline & Email (Most Important) */}
        
        <ContactItem
          icon={<FaPhoneAlt size={24} />}
          title="Support Hotline"
          content="01 2345 6789"
          link="tel:19001234"
          isLink={true}
        />
        
        <ContactItem
          icon={<CiMail size={28} />}
          title="Customer Support Email"
          content="support@ezphone.vn"
          link="mailto:support@ezphone.vn"
          isLink={true}
        />

        <div className="md:col-span-2 lg:col-span-1">
          <ContactItem
            icon={<CiLocationOn size={28} />}
            title="Head Office Address"
            content="97 Man Thien, Tang Nhon Phu, HCMC"
          />
        </div>
      </div>
      
      {/* --- SEPARATOR --- */}

      <div className="mt-12 pt-8 border-t border-border">
        <h2 className="text-2xl font-bold text-primary-700 mb-4 flex items-center gap-2">
          <FaEnvelopeOpenText size={24} /> Connect with Us on Social Media
        </h2>
          
        <ul className="flex space-x-6">
          <li>
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:text-primary-700 transition"
            >
              <FaFacebook size={40} />
            </a>
          </li>
          <li>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-pink-500 hover:text-pink-600 transition"
            >
              <FaInstagram size={40} />
            </a>
          </li>
          <li>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-secondary-600 hover:text-foreground transition"
            >
              <FaXTwitter size={40} />
            </a>
          </li>
        </ul>
      </div>

    </div>
  );
}
