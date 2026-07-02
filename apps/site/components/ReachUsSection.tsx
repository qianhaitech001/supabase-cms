import { getStaticContent, type StaticLocale } from "@/lib/static-content";

export function ReachUsSection({ locale = "en" }: { locale?: StaticLocale }) {
  const content = getStaticContent(locale);
  const isZh = locale === "zh";

  return (
    <section className="home-reach-section">
      <div className="shell reach-grid">
        <div>
          <h2>{isZh ? "联系我们：" : "REACH US AT:"}</h2>
          <p>
            <span className="text-[#ff6a00ed] font-bold">
              {isZh ? "总部地址：" : "Head office Add :"}
            </span>{" "}
            {isZh ? "中国宁波鄞州区天童南路 666 号" : "No.666 TianTong South Road, Yingzhou District, Ningbo, China"}
            <br />
            <span className="text-[#ff6a00ed] font-bold">
              {isZh ? "沙特办公室地址：" : "KSA office Add :"}
            </span>{" "}
            {isZh ? "沙特阿拉伯利雅得 Rimal Center 一楼 Dragon World Saudi Arabia E33" : "E33, Dragon World Saudi Arabia, Ground Floor Rimal Center, Riyadh, Saudi Arabia"}
            <br />
            <span className="text-[#ff6a00ed] font-bold">
              {isZh ? "英国办公室地址：" : "UK office Add :"}
            </span>{" "}
            {isZh ? "英国伦敦 Crayford Acorn Industrial Park H 单元，DA14FL" : "Unit H, Acorn industrial Park, Crayford, London, DA14FL"}
            <br />
            <span className="text-[#ff6a00ed] font-bold">
              {isZh ? "美国办公室地址：" : "USA office Add :"}
            </span>{" "}
            150 N Santa Anita Ave Suite 300 Arcadia CA91006
          </p>
        </div>
        <div className="reach-grid-item">
          <h2>{isZh ? "或发送邮件至：" : "OR EMAIL TO:"}</h2>
          <strong>{content.contact.salesEmail}</strong>
        </div>
      </div>
    </section>
  );
}
