"use client"

import { Visibility, VisibilityOff } from "@mui/icons-material"
import {
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
  useTheme,
} from "@mui/material"
import useLogin from "./hooks"
import { Controller } from "react-hook-form"
import ThemeToggleButton from "@/components/ui/toggle"

export default function LoginPage() {
  const theme = useTheme()
  const { control, handleSubmit, error, onSubmit, showPassword, setShowPassword, loading } = useLogin()

  return (
    <Box sx={{ minHeight: "100vh", display: "flex" }}>
      <Box
        sx={{
          position: "fixed",
          top: 20,
          right: 20,
          zIndex: 1000,
        }}
      >
        <ThemeToggleButton />
      </Box>

      <Box
        sx={{
          display: { xs: "none", lg: "flex" },
          width: { lg: "50%" },
          position: "relative",
          overflow: "hidden",
          background:
            theme.palette.mode === "light"
              ? theme.palette.primary.main
              : `linear-gradient(135deg, #0d1117 0%, #161b22 30%, #21262d 70%, #30363d 100%)`,
        }}
      >
        <Box
          sx={{
            position: "relative",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            px: 6,
            py: 6,
            "&::before":
              theme.palette.mode === "dark"
                ? {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "linear-gradient(135deg, rgba(79, 195, 247, 0.1) 0%, rgba(79, 195, 247, 0.05) 100%)",
                    zIndex: -1,
                  }
                : {},
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                backgroundColor: theme.palette.mode === "dark" ? theme.palette.primary.main : "white",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: 1.5,
                boxShadow: theme.palette.mode === "dark" ? "0 0 20px rgba(79, 195, 247, 0.3)" : "none",
              }}
            >
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: 1,
                  backgroundColor: theme.palette.mode === "dark" ? "white" : theme.palette.primary.main,
                }}
              />
            </Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: theme.palette.mode === "dark" ? "#f0f6fc" : "white",
                textShadow: theme.palette.mode === "dark" ? "0 2px 8px rgba(0,0,0,0.5)" : "none",
              }}
            >
              Toma-POS
            </Typography>
          </Box>

          <Box sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <Typography
              variant="h3"
              sx={{
                color: theme.palette.mode === "dark" ? "#f0f6fc" : "white",
                mb: 3,
                lineHeight: 1.2,
                textShadow: theme.palette.mode === "dark" ? "0 2px 12px rgba(0,0,0,0.6)" : "none",
                letterSpacing: theme.palette.mode === "dark" ? "0.5px" : "normal",
              }}
            >
              Effortlessly manage your team and operations.
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.mode === "dark" ? "#8b949e" : "rgba(255,255,255,0.9)",
                lineHeight: 1.5,
                opacity: theme.palette.mode === "dark" ? 1 : 0.9,
                textShadow: theme.palette.mode === "dark" ? "0 1px 4px rgba(0,0,0,0.4)" : "none",
              }}
            >
              Log in to access your dashboard.
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.mode === "dark" ? "#6e7681" : "rgba(255,255,255,0.7)",
                textShadow: theme.palette.mode === "dark" ? "0 1px 3px rgba(0,0,0,0.3)" : "none",
              }}
            >
              Copyright © 2025 Toma POS.
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          width: { xs: "100%", lg: "50%" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
          backgroundColor: theme.palette.mode === "light" ? "white" : theme.palette.background.default,
        }}
      >
        <Container maxWidth="sm">
          <Box sx={{ display: { lg: "none" }, mb: 4, textAlign: "center" }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 1.5,
                backgroundColor: theme.palette.primary.main,
              }}
            >
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  backgroundColor: "white",
                  borderRadius: 1,
                }}
              />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Toma-POS
            </Typography>
          </Box>

          <Paper
            elevation={theme.palette.mode === "dark" ? 8 : 0}
            sx={{
              p: theme.palette.mode === "dark" ? 4 : 0,
              backgroundColor: theme.palette.mode === "dark" ? theme.palette.background.paper : "transparent",
              border: theme.palette.mode === "dark" ? `1px solid ${theme.palette.divider}` : "none",
              borderRadius: theme.palette.mode === "dark" ? 3 : 0,
            }}
          >
            <Box sx={{ mb: 4, textAlign: "center" }}>
              <Typography
                variant="h3"
                sx={{
                  mb: 1,
                  color: theme.palette.mode === "dark" ? theme.palette.text.primary : "inherit",
                }}
              >
                Welcome Back
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Enter your email and password to access your account.
              </Typography>
            </Box>

            <Box
              component="form"
              sx={{ display: "flex", flexDirection: "column", gap: 3 }}
              onSubmit={handleSubmit(onSubmit)}
            >
              <Controller
                name="username"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Username"
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        height: 48,
                        backgroundColor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "transparent",
                        "&:hover": {
                          backgroundColor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "transparent",
                        },
                        "&:hover fieldset": {
                          borderColor: theme.palette.mode === "dark" ? theme.palette.primary.light : "#3F3FF3",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: theme.palette.mode === "dark" ? theme.palette.primary.light : "#3F3FF3",
                          borderWidth: 2,
                        },
                        "&.Mui-focused": {
                          backgroundColor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "transparent",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: theme.palette.mode === "dark" ? theme.palette.text.secondary : "inherit",
                        "&.Mui-focused": {
                          color: theme.palette.mode === "dark" ? theme.palette.primary.light : "#3F3FF3",
                        },
                      },
                    }}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />

              <Controller
                name="password"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    variant="outlined"
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              sx={{
                                color: theme.palette.mode === "dark" ? theme.palette.text.secondary : "inherit",
                                "&:hover": {
                                  backgroundColor:
                                    theme.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)",
                                },
                              }}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        height: 48,
                        backgroundColor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "transparent",
                        "&:hover": {
                          backgroundColor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "transparent",
                        },
                        "&:hover fieldset": {
                          borderColor: theme.palette.mode === "dark" ? theme.palette.primary.light : "#3F3FF3",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: theme.palette.mode === "dark" ? theme.palette.primary.light : "#3F3FF3",
                          borderWidth: 2,
                        },
                        "&.Mui-focused": {
                          backgroundColor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "transparent",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: theme.palette.mode === "dark" ? theme.palette.text.secondary : "inherit",
                        "&.Mui-focused": {
                          color: theme.palette.mode === "dark" ? theme.palette.primary.light : "#3F3FF3",
                        },
                      },
                    }}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />

              {error && (
                <Typography variant="body2" color="error">
                  {error}
                </Typography>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  height: 48,
                  background:
                    theme.palette.mode === "light"
                      ? theme.palette.primary.main
                      : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  "&:hover": {
                    background:
                      theme.palette.mode === "light"
                        ? theme.palette.primary.main
                        : `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                    transform: "translateY(-1px)",
                    boxShadow:
                      theme.palette.mode === "dark"
                        ? "0 8px 25px rgba(63, 63, 243, 0.3)"
                        : "0 4px 12px rgba(63, 63, 243, 0.2)",
                  },
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 500,
                  transition: "all 0.2s ease-in-out",
                  boxShadow: theme.palette.mode === "dark" ? "0 4px 15px rgba(63, 63, 243, 0.2)" : "none",
                }}
              >
                {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Log In"}
              </Button>

              <Box sx={{ textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  Don&apos;t Have An Account? Contact Your Service Provider
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  )
}
