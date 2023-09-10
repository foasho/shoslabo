import React from "react";
import clsx from "clsx";

export type TypographyProps = {
  variant: "h1" | "h2" | "h3" | "h4" | "h5" | "body1" | "body2" | "caption";
  className?: string;
  color?: "primary" | "secondary" | string;
  align?: "left" | "center" | "right" | undefined;
  style?: React.CSSProperties;
  children: React.ReactNode;
};

const commonHeadingClass = "leading-[1.5] tracking-[0.04em] font-[500] md:font-[400]";
const commonParagraphClass = "leading-[1.7] tracking-[0.04em] font-[400]";

export const Typography = ({
  variant,
  className,
  color = "#1A1A1C",
  align,
  style,
  children,
}: TypographyProps) => {
  // colorがprimaryかsecondary以外であれば、styleにOverrideする
  const mergedStyle =
    color === "primary" || color === "secondary" ? style : { ...style, color: color };

  const alignClass =
    align === "left"
      ? "text-left"
      : align === "center"
      ? "text-center"
      : align === "right"
      ? "text-right"
      : "";

  const colorClass =
    color === "primary" ? "text-primary" : color === "secondary" ? "text-secondary" : "";

  const commonClass = clsx(alignClass, colorClass, className);

  return (
    <>
      {variant === "h1" && (
        <h1
          className={clsx(
            "text-[32px] md:text-[36px]  md:leading-[1.4]",
            commonHeadingClass,
            commonClass
          )}
          style={mergedStyle}
        >
          {children}
        </h1>
      )}
      {variant === "h2" && (
        <h2
          className={clsx("text-[28px] md:text-[32px]", commonHeadingClass, commonClass)}
          style={mergedStyle}
        >
          {children}
        </h2>
      )}
      {variant === "h3" && (
        <h3
          className={clsx("text-[24px] md:text-[28px]", commonHeadingClass, commonClass)}
          style={mergedStyle}
        >
          {children}
        </h3>
      )}
      {variant === "h4" && (
        <h4
          className={clsx("text-[20px] md:text-[24px]", commonHeadingClass, commonClass)}
          style={mergedStyle}
        >
          {children}
        </h4>
      )}
      {variant === "h5" && (
        <h5
          className={clsx("text-[16px] md:text-[20px]", commonHeadingClass, commonClass)}
          style={mergedStyle}
        >
          {children}
        </h5>
      )}
      {variant === "body1" && (
        <p className={clsx("text-[16px]", commonParagraphClass, commonClass)} style={mergedStyle}>
          {children}
        </p>
      )}
      {variant === "body2" && (
        <p className={clsx("text-[14px]", commonParagraphClass, commonClass)} style={mergedStyle}>
          {children}
        </p>
      )}
      {variant === "caption" && (
        <span
          className={clsx("text-[12px] tracking-[0.02em]", commonParagraphClass, commonClass)}
          style={mergedStyle}
        >
          {children}
        </span>
      )}
    </>
  );
};
