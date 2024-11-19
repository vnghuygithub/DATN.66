interface NotiIconProps {
  type?: 'success' | 'alert';
}

const NotiIcon: React.FC<NotiIconProps> = ({ type, ...restProps }) => {
  let fill = '#B2B2B2';

  if (type === 'alert') {
    fill = '#FF0000';
  }

  if (type === 'success') {
    fill = '#10CA00';
  }
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12.0011 21C13.0163 21 13.8468 20.1692 13.8468 19.1538H10.1554C10.1554 19.6435 10.3499 20.1131 10.696 20.4593C11.0422 20.8055 11.5116 21 12.0011 21ZM17.5382 15.4615V10.8462C17.5382 8.01231 16.0247 5.64 13.3854 5.01231V4.38462C13.3854 3.61846 12.7671 3 12.0011 3C11.2352 3 10.6169 3.61846 10.6169 4.38462V5.01231C7.96831 5.64 6.46407 8.00308 6.46407 10.8462V15.4615L5.2736 16.6523C4.69221 17.2338 5.09826 18.2308 5.91959 18.2308H18.0735C18.8948 18.2308 19.3101 17.2338 18.7287 16.6523L17.5382 15.4615Z"
        fill={fill}
      />
    </svg>
  );
};

export default NotiIcon;
