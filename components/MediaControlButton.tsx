import React, { FC } from 'react';
import { IconButton, IconButtonProps } from '@chakra-ui/react';

interface MediaControlButtonProps extends Omit<IconButtonProps, 'aria-label'> {
  label: string; Icon: FC;
}
export const MediaControlButton: FC<MediaControlButtonProps> = ({ label, Icon, ...rest }) => {
  return <IconButton aria-label={label} icon={<Icon />} variant={'ghost'} bgColor="transparent" borderRadius={'99px'} size="md" fontSize={'24px'} {...rest} />;
};
