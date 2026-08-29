
import {
    Body,
    Container,
    Heading,
    Html,
    Preview,
    Section,
    Tailwind,
    Text,
} from "@react-email/components";

interface PasswordRecoveryEmailProps {
    email: string;
    otp: string;
}

export function PasswordRecoveryEmail({
    email,
    otp,
}: PasswordRecoveryEmailProps) {
    return (
        <Html>
            <Preview>Your password recovery OTP</Preview>

            <Tailwind>
                <Body className="bg-gray-100 py-10 font-sans">
                    <Container className="mx-auto max-w-[600px] rounded-xl bg-white px-8 py-10">

                        {/* Company Name */}
                        <Section className="text-center">
                            <Heading className="mt-5 text-2xl font-bold text-black">
                                Taakdoom
                            </Heading>

                            <Text className="mt-4 text-base leading-6 text-gray-600">
                                We received a request to reset your password.
                            </Text>
                        </Section>

                        {/* Divider */}
                        <Section className="my-6 border-t border-gray-200" />

                        {/* Recovery Details */}
                        <Section className="px-6">
                            <Text className="m-0 text-sm font-semibold text-gray-500">
                                Email
                            </Text>

                            <Text className="mt-1 text-base text-gray-900">
                                {email}
                            </Text>

                            <Text className="mt-5 mb-0 text-sm font-semibold text-gray-500">
                                Your OTP
                            </Text>

                            <Section className="mt-2 rounded-2xl bg-gray-50 px-5 py-5 text-center">
                                <Text className="m-0 text-3xl font-bold tracking-[8px] text-gray-900">
                                    {otp}
                                </Text>
                            </Section>

                            <Text className="mt-5 text-sm leading-6 text-gray-500">
                                Use this OTP to reset your password. This code
                                is valid for a limited time. If you did not
                                request a password reset, you can safely ignore
                                this email.
                            </Text>
                        </Section>

                        {/* Footer */}
                        <Section className="mt-8 border-t border-gray-200 pt-6 text-center">
                            <Text className="m-0 py-5 text-sm text-gray-400">
                                This is an automated message from the Taakdoom
                                website. Don't reply to this message.
                            </Text>
                        </Section>

                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}
