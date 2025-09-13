import React from 'react';
import { toast } from 'react-hot-toast';
import { FaTwitter, FaFacebook, FaWhatsapp, FaLink, FaInstagram } from 'react-icons/fa';
import './ShareButtons.css';

const ShareButtons = ({ title, actionId }) => {
  // 1. Remove trailing space and insert your real domain
  const baseUrl = 'https://your-website.com'; // <-- change to your live domain
  const shareUrl = `${baseUrl}/activity/${actionId}`;
  const shareText = `Check out this environmental action: "${title}"! Join the community at EcoHub.`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success('Link copied to clipboard!');
  };

  const shareOnInstagram = async () => {
    // Try native Web Share API first (mobile only)
    if (navigator.share) {
      try {
        await navigator.share({ title, text: shareText, url: shareUrl });
        return;
      } catch (e) { /* user cancelled */ }
    }
    // Fallback: copy link
    navigator.clipboard.writeText(shareUrl);
    toast.success('Link copied! Paste it into your Instagram story or post.');
  };

  return (
    <div className="share-buttons-container">
      <p>Share:</p>

      {/* Twitter */}
      <a
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
          shareUrl
        )}&text=${encodeURIComponent(shareText)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="share-button twitter"
        aria-label="Share on Twitter"
      >
        <FaTwitter />
      </a>

      {/* Facebook */}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          shareUrl
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="share-button facebook"
        aria-label="Share on Facebook"
      >
        <FaFacebook />
      </a>

      {/* WhatsApp */}
      <a
        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
          shareText + ' ' + shareUrl
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="share-button whatsapp"
        aria-label="Share on WhatsApp"
      >
        <FaWhatsapp />
      </a>

      {/* Instagram (copy / native share) */}
      <button
        onClick={shareOnInstagram}
        className="share-button instagram"
        aria-label="Share on Instagram"
      >
        <FaInstagram />
      </button>

      {/* Copy link */}
      <button
        onClick={copyToClipboard}
        className="share-button copy-link"
        aria-label="Copy link"
      >
        <FaLink />
      </button>
    </div>
  );
};

export default ShareButtons;