import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Image,
  Input,
  Link,
  Spacer,
  Stack,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { PasswordField } from "../../components/auth/PasswordField";
import {
  validatePassword,
  validateUsername,
} from "../../lib/hooks/validateUser";

import { CometChat } from "@cometchat-pro/chat";
import { GoogleLogin } from "react-google-login";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { GoogleIcon } from "../../components/auth/googleIcon";
import { setAccessToken, setRefreshToken, setUserData } from "../../lib/auth";
import axios from "../../lib/axios";
import { toast_error, toast_success } from "../../lib/hooks/toast";
import appSettings from "../../settings/appSettings";

export default function LoginPage({ setUser }) {
  const { t } = useTranslation();
  const toast = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const authKey = "3b0db8aaee7bcdac11dbd9593168e67804279774";
  const onUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const onPasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const validate = () => {
    let ok = true;

    if (validateUsername(username) === false) {
      const model = toast_error(
        t("auth.login_fail"),
        t("auth.username_condition"),
        //"Username has a minimum length of 8 characters and contains only lowercase letters or numbers"
      );
      toast(model);
      ok = false;
    }

    if (validatePassword(password) === false) {
      const model = toast_error(
        t("auth.login_fail"),
        t("auth.password_condition"),
        //"Password has a minimum length of 8 characters and do not contain any special charaters."
      );
      toast(model);
      ok = false;
    }
    return ok;
  };

  const onSubmit = () => {
    const ok = validate();
    if (ok) {
      const ok = validate();

      if (ok) {
        const body = { username, password };
        setLoading(true);
        axios
          .post(`${appSettings.API_PROXY}/login`, body)
          .then((resp) => {
            setAccessToken(resp?.data?.access_token);
            setRefreshToken(resp?.data?.refresh_token);
            setUserData(resp?.data?.user);
            setUser(resp?.data?.user);
            toast(toast_success("Login successfully."));
            initializeAndSetup(resp?.data?.user.id, resp?.data?.user.name);
            navigate("/");
          })
          .catch((err) => {
            if (err?.response) toast(toast_error(err?.response?.data));
            else toast(toast_error(t("common.something_went_wrong")));
            console.log(err);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }
  };

  const onGoogleLoginSuccess = (resp) => {
    const { email, name } = resp.profileObj;
    setLoading(true);
    axios
      .post(`${appSettings.API_PROXY}/login-google`, { email, name })
      .then((resp) => {
        setAccessToken(resp?.data?.access_token);
        setRefreshToken(resp?.data?.refresh_token);
        setUserData(resp?.data?.user);
        setUser(resp?.data?.user);
        toast(toast_success("Login successfully."));
        initializeAndSetup(resp?.data?.user.id, resp?.data?.user.name);
        navigate("/");
      })
      .catch((err) => {
        if (err?.response) toast(toast_error(err?.response?.data));
        else toast(toast_error(t("common.something_went_wrong")));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onGoogleLoginFail = (resp) => {
    toast(toast_error(t("auth.login_fail")));
    console.log(resp);
  };

  const createUserInCometChat = async (UID, name, authKey) => {
    try {
      var user = new CometChat.User(UID);
      user.setName(name);

      const createdUser = await CometChat.createUser(user, authKey);
      return createdUser;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  };

  const initializeCometChat = async (UID, authKey) => {
    try {
      const user = await CometChat.getLoggedinUser();
      if (!user) {
        await CometChat.login(UID, authKey);
        console.log("Login Successful:");
      } else {
        console.log("User already logged in:");
      }
    } catch (error) {
      console.log("Something went wrong", error);
      throw error;
    }
  };

  const setupLoginListener = async (listenerID) => {
    CometChat.addLoginListener(
      listenerID,
      await CometChat.LoginListener({
        loginSuccess: (e) => {
          console.log("LoginListener :: loginSuccess", e);
        },
        loginFailure: (e) => {
          console.log("LoginListener :: loginFailure", e);
        },
        logoutSuccess: () => {
          console.log("LoginListener :: logoutSuccess");
        },
        logoutFailure: (e) => {
          console.log("LoginListener :: logoutFailure", e);
        },
      }),
    );
  };

  const initializeAndSetup = async (UID, name) => {
    try {
      await initializeCometChat(UID, authKey);
    } catch (error) {
      await createUserInCometChat(UID, name, authKey);
      await initializeCometChat(UID, authKey);
    } finally {
      await setupLoginListener(UID);
    }
  };

  return (
    <Container maxW="lg">
      <Stack spacing="8">
        <Stack>
          <VStack>
            <HStack>
              <Image
                src="/logo.png"
                alt={t("common.ute_chess_club")}
                h={16}
                w={16}
              />
              <Text
                fontSize="xl"
                fontWeight="bold"
                display={{ md: "block", sm: "none" }}
                cursor="pointer"
              >
                {t("common.ute_chess_club")}
              </Text>
            </HStack>
          </VStack>
        </Stack>
        <Box
          py={{
            base: "0",
            sm: "8",
          }}
          px={{
            base: "4",
            sm: "10",
          }}
          bg={{
            base: "transparent",
            sm: "bg.surface",
          }}
          boxShadow={{
            base: "none",
            sm: "md",
          }}
          borderRadius={{
            base: "none",
            sm: "xl",
          }}
        >
          <Stack spacing="6">
            <Stack
              spacing={{
                base: "2",
                md: "3",
              }}
              textAlign="center"
            >
              <Heading
                size={{
                  base: "sm",
                  md: "md",
                }}
              >
                {t("auth.login_to_your_account")}
              </Heading>
            </Stack>
            <Stack spacing="5">
              <FormControl>
                <FormLabel htmlFor="username">{t("auth.username")}</FormLabel>
                <Input
                  id="username"
                  type="username"
                  required
                  onChange={onUsernameChange}
                />
              </FormControl>
              <PasswordField onChange={onPasswordChange} />
            </Stack>
            <HStack justify="space-between">
              <Spacer />
              <Button
                variant="text"
                size="sm"
                onClick={() => navigate("/forgot-password")}
              >
                {t("auth.forgot_password")}
              </Button>
            </HStack>
            <Stack spacing="4">
              <Button onClick={onSubmit} isLoading={loading}>
                {t("auth.login")}
              </Button>
              <HStack>
                <Divider />
                <Text color={"gray"}>{t("auth.or")}</Text>
                <Divider />
              </HStack>
              <GoogleLogin
                clientId="792034127875-ia2do320uupm2vvi5amm83b8kkbr9l2q.apps.googleusercontent.com"
                onSuccess={onGoogleLoginSuccess}
                onFailure={onGoogleLoginFail}
                cookiePolicy={"single_host_origin"}
                render={(renderProps) => (
                  <Button onClick={renderProps.onClick} isLoading={loading}>
                    <Text color={"gray"} size={"md"} mr={2}>
                      Google
                    </Text>
                    <GoogleIcon />
                  </Button>
                )}
              />
              <Text color="fg.muted" textAlign="center">
                {t("auth.dont_have_account")}
                <Link href="/register" color="darkcyan">
                  {t("auth.register")}
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}
