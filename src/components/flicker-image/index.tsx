import React, { DetailedHTMLProps, ImgHTMLAttributes, useState } from 'react';
import { Link } from 'react-router-dom';

interface FlickerImageProps extends DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
  altsrc: string;
  link?: string;
  wrapperClassName?: string;
}

export const FlickerImage: React.FC<FlickerImageProps> = props => {
  const { altsrc, link, wrapperClassName, alt, className, src, ...restProps } = props;
  const [image, setImage] = useState(props.src);

  const handleMouseOver = (image: string) => {
    setImage(image);
  };

  const linkWrapper = (element: JSX.Element) => {
    return <Link to={link!}>{element}</Link>;
  };

  const renderImage = () => {
    return (
      <img
        {...restProps}
        className={className}
        src={image}
        alt={alt}
        onMouseEnter={() => {
          handleMouseOver(altsrc);
        }}
        onMouseLeave={() => {
          handleMouseOver(src!);
        }}
      />
    );
  };

  return <div className={`flickerImageWrapper ${wrapperClassName}`}>{link ? linkWrapper(renderImage()) : renderImage()}</div>;
};
