import MyForm from '@/components/core/form';
import { meetingRoomOptions } from '@/const/options';
import { useEffect, useState } from 'react';

interface IMeetingRooms {
  value: number;
  label: string;
}

const SelectMeetingRooms = ({ ...props }) => {
  const { isModalOpen } = props;
  const [room, setRoom] = useState<IMeetingRooms[]>([]);
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    meetingRoomOptions().then(res => {
      if (isMounted) {
        setRoom(res);
      }
    });

    return () => {
      setIsMounted(false);
    };
  }, []);

  return (
    <MyForm.Item
      options={room}
      label={isModalOpen ? '' : 'Phòng họp'}
      {...props}
      name="room"
      type="select"
      innerprops={{
        showSearch: true,
        placeholder: 'chọn Phòng họp',
        allowClear: true,
        loading: !room.length,
      }}
    />
  );
};

export default SelectMeetingRooms;
