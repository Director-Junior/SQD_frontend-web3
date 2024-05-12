"use client";

interface Props {
  props: string;
}

const WriteIcon = ({ props }: Props) => {
  return (
    <>
      <svg
        width="20"
        height="20"
        viewBox="0 0 15 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1.4 14C1.015 14 0.685417 13.8631 0.41125 13.5893C0.137083 13.3154 0 12.9863 0 12.6017V2.81398C0 2.42946 0.137083 2.10029 0.41125 1.82647C0.685417 1.55264 1.015 1.41573 1.4 1.41573H7.6475L6.2475 2.81398H1.4V12.6017H11.2V7.74282L12.6 6.34457V12.6017C12.6 12.9863 12.4629 13.3154 12.1888 13.5893C11.9146 13.8631 11.585 14 11.2 14H1.4ZM4.2 9.80524V6.83396L10.6225 0.419476C10.7625 0.27965 10.92 0.174782 11.095 0.104869C11.27 0.0349563 11.445 0 11.62 0C11.8067 0 11.9846 0.0349563 12.1538 0.104869C12.3229 0.174782 12.4775 0.27965 12.6175 0.419476L13.5975 1.41573C13.7258 1.55556 13.825 1.70995 13.895 1.8789C13.965 2.04786 14 2.21973 14 2.39451C14 2.56929 13.9679 2.74116 13.9038 2.91011C13.8396 3.07907 13.7375 3.23346 13.5975 3.37328L7.175 9.80524H4.2ZM5.6 8.40699H6.58L10.64 4.35206L10.15 3.86267L9.6425 3.37328L5.6 7.41074V8.40699Z"
          fill={props}
          fillOpacity="0.6"
        />
      </svg>
    </>
  );
};

export default WriteIcon;