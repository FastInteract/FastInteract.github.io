# VLM-QA Protocol Documentation

This documentation specifies HOI-QA50-Strict-Proxy version 3.0.0, an independently defined strict proxy for human-object interaction evaluation.

- `question-bank.json`: exact original bilingual protocol configuration, with all 50 questions, applicability rules, FAIL conditions, category weights and critical caps.
- `question-bank.md`: complete English question bank.
- `judge-system-prompt.txt`: exact judging system prompt.
- `judging-example.txt`: complete instantiated system/user judging request.
- `profile-system-prompt.txt`: exact pre-video applicability system prompt.
- `profile-prompt-example.txt`: complete system/user applicability example.
- `profile-schema.json`: complete pre-video action/applicability response schema.
- `judgment-schema-C01.json`: exact single-question judging response schema example.
- `judge-settings.json`: recorded model/backend, decoding settings and requested video FPS.
- `SHA256SUMS`: documentation checksums.

Applicability is determined before inspecting generated outputs and shared across methods. Each applicable question is judged independently. CLEAN receives one credit; DEFECT and UNCERTAIN receive zero; NOT_APPLICABLE is excluded from the denominator. The webpage specifies category scoring, the weighted harmonic mean, all seven cap rules, and the exact sampling procedure.

Backend retries correct request/decoding failures; semantic retries correct invalid fields or evidence. They do not perform majority voting or choose favorable valid judgments. The configuration's human-audit rule is a protocol audit requirement and does not assert that a human agreement experiment has been completed.

The archive provides the protocol specification and exact request/response examples.

Verify documentation files with `shasum -a 256 -c SHA256SUMS`.

Question configuration SHA-256: 9f4dabbe3ec0bbe121820823d4ce841ed896959518bcc04ce0b91b60161df4b2
