import { Tooltip } from '../../../Tooltip';
import { useTranslation } from 'react-i18next';
import { uiActions } from '../../../../store/slices/ui';
import { useAppDispatch, useAppSelector } from '../../../../store/store';
import { DeviceIcon, PhoneIcon } from '../../../Icons';

const DeviceButton = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation(['playingBar']);
  const isDeviceOpen = useAppSelector((state) => !state.ui.devicesCollapsed);

  const currentDevice = useAppSelector((state) => state.spotify.activeDeviceType);

  return (
    <Tooltip title={t('Connect to a device')}>
      <button
        onClick={() => dispatch(uiActions.toggleDevices())}
        className={isDeviceOpen ? 'active-icon-button' : ''}
        style={{ marginTop: 4, cursor: isDeviceOpen ? 'pointer' : 'not-allowed' }}
      >
        {currentDevice === 'Smartphone' ? (
          <PhoneIcon active={isDeviceOpen} />
        ) : (
          <DeviceIcon active={isDeviceOpen} />
        )}
      </button>
    </Tooltip>
  );
};

export default DeviceButton;
