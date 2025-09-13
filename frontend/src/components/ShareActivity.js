import React from 'react';
import { toast } from 'react-hot-toast';
import {
  FaTwitter, FaFacebook, FaWhatsapp, FaLink, FaInstagram
} from 'react-icons/fa';
import './ShareButtons.css';

const ShareButtons = ({ title, actionId }) => {
  const baseUrl = 'https://meregreenaction.com';   
  const shareUrl = `${baseUrl}/activity/${actionId}`;
  const shareText = `Check out this environmental action: "${title}"! Join the community at EcoHub.`;

  /* 2. Copy to clipboard */
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast.success('Link copied to clipboard!');
    });
  };

  const shareOnInstagram = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: shareText, url: shareUrl });
        return;
      } catch (e) { /* user cancelled */ }
    }
    await navigator.clipboard.writeText(shareUrl);
    toast.success('Link copied! Paste it in your Instagram story / bio.');
  };

  return (
    <div className="share-buttons-container">
      <p>Share:</p>

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

      <button
        onClick={shareOnInstagram}
        className="share-button instagram"
        aria-label="Share on Instagram"
      >
        <FaInstagram />
      </button>

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