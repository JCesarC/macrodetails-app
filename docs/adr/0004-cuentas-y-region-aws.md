# ADR 0004 · Estructura de cuentas y región de AWS

- **Estado:** aceptado
- **Fecha:** 2026-11-18

## Contexto

La cuenta de AWS se creó con el asistente de alta, que armó una AWS Organization con tres cuentas y una SCP de restricción de regiones:

| Cuenta                   | Uso                                                                    |
| ------------------------ | ---------------------------------------------------------------------- |
| Management               | Facturación, presupuestos, Organizations y SCPs. Sin cargas de trabajo |
| Identity Delegated Admin | IAM Identity Center (usuarios y permission sets)                       |
| JCCMACRO                 | Cargas de trabajo de MacroDetails                                      |

La SCP `AdvancedModeRegionRestrictionSecurityControlPolicy`:

- En **us-east-1** solo permite servicios globales (IAM, CloudFront, Route 53, ACM, STS, facturación…). CloudFormation, SSM y la creación de recursos regionales están negados.
- En **us-west-2** solo permite servicios de identidad.
- Fuera de us-east-1, us-east-2 y us-west-2 niega todo excepto la invocación de modelos de Bedrock.
- **us-east-2 no tiene restricciones.**

## Decisión

- Las cargas de trabajo (CloudFormation/CDK, S3, cómputo, secretos) viven en **us-east-2 (Ohio)**, en la cuenta JCCMACRO.
- La SCP se mantiene sin cambios: es una barrera útil contra recursos creados por error en otras regiones.
- Los servicios globales (CloudFront, IAM, ACM para certificados de CloudFront) se siguen llamando en us-east-1, lo cual la SCP permite.
- Acceso humano solo por IAM Identity Center (perfil de CLI `jcc-macro`); sin access keys de larga duración.

## Consecuencias

- ✅ No hay que debilitar los guardrails de la organización para desplegar.
- ✅ Bedrock sigue disponible en todas las regiones, útil para la parte de AI.
- ⚠️ Cualquier recurso nuevo debe crearse en us-east-2; un deploy a us-east-1 fallará con un _explicit deny_.
- ⚠️ MongoDB Atlas debería ubicarse en AWS us-east-2 para minimizar latencia con la API.
