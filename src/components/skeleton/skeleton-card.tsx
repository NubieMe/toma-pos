"use client";

import React from "react";
import { Card, CardContent, Skeleton, Grid } from "@mui/material";

interface SkeletonCardListProps {
  length?: number;
}

const SkeletonCardList: React.FC<SkeletonCardListProps> = ({ length = 6 }) => {
  return (
    <Grid container spacing={2}>
      {Array.from({ length }).map((_, index) => (
        <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ minHeight: 180 }}>
            <CardContent>
              <Skeleton variant="text" width="60%" height={30} />
              <Skeleton variant="text" width="50%" height={20} />
              <Skeleton variant="text" width="40%" height={20} sx={{ mb: 2 }} />
              <Skeleton variant="text" width="70%" height={28} />
              <Skeleton variant="text" width="50%" height={20} sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" width="100%" height={40} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default SkeletonCardList;
