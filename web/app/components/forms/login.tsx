"use client";

import { useState } from "react";
import {
  Button,
  Description,
  FieldError,
  Form,
  Input,
  Label,
  Radio,
  RadioGroup,
  TextField,
} from "@heroui/react";

const HOSTNAME_PATTERN =
  /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

function validateAddress(value: string) {
  const octets = value.split(".");

  if (octets.length === 4 && octets.every((octet) => /^\d{1,3}$/.test(octet))) {
    const inRange = octets.every((octet) => Number(octet) <= 255);
    return inRange ? null : "Each part of the IP address must be between 0 and 255";
  }

  if (HOSTNAME_PATTERN.test(value)) {
    return null;
  }

  return "Enter a valid IP address or hostname";
}

export type LoginCredentials = {
  address: string;
  protocol: "http" | "https";
  username: string;
  password: string;
};

export type LoginFormProps = {
  onLogin?: (credentials: LoginCredentials) => void | Promise<void>;
};

export function LoginForm({ onLogin }: LoginFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const credentials: LoginCredentials = {
      address: (formData.get("address") ?? "").toString(),
      protocol: formData.get("protocol") === "https" ? "https" : "http",
      username: (formData.get("username") ?? "").toString(),
      password: (formData.get("password") ?? "").toString(),
    };

    setError(null);
    setIsSubmitting(true);

    try {
      // TODO: wire this up to the real router authentication flow once the
      // backend/API for talking to the router is in place.
      await onLogin?.(credentials);
    } catch {
      setError("Couldn't log in. Check the address, username, and password and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form className="flex flex-col gap-4" onSubmit={onSubmit}>
      <TextField isRequired name="address" defaultValue="192.168.100.1" validate={validateAddress}>
        <Label>Router address</Label>
        <Input placeholder="192.168.100.1" />
        <FieldError />
      </TextField>

      <RadioGroup name="protocol" defaultValue="http" orientation="horizontal">
        <Label>Protocol</Label>
        <Radio value="http">
          <Radio.Content>
            <Radio.Control>
              <Radio.Indicator />
            </Radio.Control>
            <Label>HTTP</Label>
          </Radio.Content>
        </Radio>
        <Radio value="https">
          <Radio.Content>
            <Radio.Control>
              <Radio.Indicator />
            </Radio.Control>
            <Label>HTTPS</Label>
          </Radio.Content>
        </Radio>
      </RadioGroup>

      <TextField isRequired name="username" defaultValue="root">
        <Label>Username</Label>
        <Input placeholder="root" />
        <FieldError />
      </TextField>

      <TextField isRequired name="password" type="password">
        <Label>Password</Label>
        <Input placeholder="Enter your password" />
        <FieldError />
      </TextField>

      {error && (
        <Description className="text-danger text-sm">{error}</Description>
      )}

      <Button type="submit" fullWidth isDisabled={isSubmitting}>
        {isSubmitting ? "Logging in…" : "Log in"}
      </Button>
    </Form>
  );
}
