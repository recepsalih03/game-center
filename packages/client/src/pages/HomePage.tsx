import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Box, Typography, Button } from "@mui/material";
import api from "../api/axios";

const HomePage: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  const [msg, setMsg] = useState<string>("Yükleniyor...");

  useEffect(() => {
    api
      .get<{ msg: string }>("/protected")
      .then(res => setMsg(res.data.msg))
      .catch(() => setMsg("Sunucuya bağlanılamadı veya token geçersiz"));
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Hoş geldin, {user?.email}
      </Typography>
      <Button variant="contained" color="secondary" onClick={logout}>
        Çıkış Yap
      </Button>
    </Box>
  );
};

export default HomePage;