import React from 'react';
import iconJPG from "../images/icon-jpg.png";
import iconPNG from "../images/icon-png.png";
import iconPDF from "../images/icon-pdf.png";
import iconVideo from "../images/icon-video.png";
import iconWord from "../images/icon-word.png";
import iconPPT from "../images/icon-ppt.png";

interface FileIconProps {
  fileType?: string;
  width: number;
}

const FileIcon: React.FC<FileIconProps> = ({ fileType = '', width }) => {
  const getFileIcon = () => {
    switch (fileType) {
      case 'jpg':
        return iconJPG;
      case 'png':
        return iconPNG;
      case 'pdf':
        return iconPDF;
      case 'mp4':
        return iconVideo;
      case 'docx':
        return iconWord;
      case 'ppt':
        return iconPPT;
      default:
        return ''; // Devuelve una cadena vacía en lugar de null
    }
  };

  return (
    <img
      src={getFileIcon()}
      alt=""
      width={width}
      className='invert'
    />
  );
};

export default FileIcon;


