import React from "react";
import { Box, Typography } from "@mui/material";
import NoDataIcon from "../icon/no-data-icon";

function NoData({
  mini = false,
  typeMsg = "default",
  className = "loading-datas",
}) {
  const messageCustom: any = {
    custom: {
      title: "Informasi Tidak Tersedia",
      desc: "Mohon maaf, informasi yang Anda cari tidak dapat ditampilkan karena data yang diperlukan mungkin tidak lengkap atau tidak tersedia. Pastikan semua informasi yang diperlukan telah diinput dengan benar.",
    },
    default: {
      showIcon: true,
      title: "No Data",
      desc: "Sorry, the data is not yet available.",
    },
  };
  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Box className="text-center w-100 d-flex flex-column align-items-center justify-content-center bg-white">
        {!Boolean(mini) && (
          <>
            {messageCustom[typeMsg]?.showIcon && (
              <Box
                className="w-100"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <NoDataIcon width={100} height={90} />
              </Box>
            )}
            <Typography className="mt-8 mb-0">
              {messageCustom[typeMsg]?.title}
            </Typography>
            <p>{messageCustom[typeMsg]?.desc}</p>
          </>
        )}
        {Boolean(mini) && (
          <>
            <Typography className="fw-bold mb-0">
              {messageCustom[typeMsg]?.title}
            </Typography>
            {typeMsg == "default" && <p>{messageCustom[typeMsg]?.desc}</p>}
          </>
        )}
      </Box>
    </Box>
  );
}

export default NoData;

// export const TextNoData = styled.h1`
//   font-style: normal;
//   font-weight: 500;
//   font-size: 1.067rem;
//   line-height: 1.533rem;
//   text-align: center;
//   letter-spacing: 0.021rem;
//   color: var(--black-500);
// `
// export const TextDesciption = styled.p`
//   font-style: normal;
//   font-weight: 400;
//   font-size: 0.9rem;
//   line-height: 1.333rem;
//   text-align: center;
//   letter-spacing: 0.021rem;
//   color: var(--black-300);
//   max-width: 70%;
//   margin: 0 auto;
// `
