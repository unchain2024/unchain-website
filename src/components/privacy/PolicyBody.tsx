import type { ReactNode } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import { useLang } from "@/lib/language";

/**
 * Policy body — `public/privacy-policy/Section.svg` (1440x3422).
 *
 * One #F5F5F5 card, 16px inside the 1440 canvas on every side and 16px-rounded, holding a
 * 648px measure centred in it (x 396..1044). Everything in it is 16px type on a 22px
 * leading: body copy in #414651, the numbered headings in 20px bold black on a 28px
 * leading, and the contact desk name in 16px black.
 *
 * The export's rhythm, read off its ink boxes rather than guessed, then confirmed against
 * the built page — all eleven headings land on the export's own y:
 *   - 40px above every numbered heading, 12px below it, and 12px between the blocks inside
 *     a section (paragraph -> list, list -> trailing paragraph).
 *   - 12px between list items, over a 26px minimum item height. That minimum is what makes
 *     the export's two spacings agree: single-line items sit 38px apart and wrapped ones
 *     n*22 + 12, which a plain gap alone cannot produce. Paragraphs have no such floor —
 *     giving them one puts everything below section 3 four pixels low.
 *   - Bullets are 6px #A4A7AE dots centred 12.4px into the item's first line, 12px in from
 *     the measure and 12px clear of the text, which starts at x=426.
 *
 * One residual is the export's own and not fixable from here: it sets the contact address
 * ~11% narrower than Inter does at 16px, so that one line measures 174px against 194.
 *
 * The text is written out literally in both languages rather than mapped out of a table, so
 * it stays selectable, indexable and translatable in place — the drawing is identical on
 * `/privacy-policy` and `/en/privacy-policy`, only the copy changes.
 */

type Block = { children: ReactNode; className?: string; probe?: string };

/**
 * What makes the copy break where Figma drew it, as on the terms page: Chrome's defaults let
 * a small kana open a line and compress the gap between adjacent full-width punctuation
 * ("す。）"), which fits an extra character per line and walks every break after it.
 */
const BREAK = "[line-break:strict] [text-spacing-trim:space-all]";

/** 16px/22px body copy. Paragraphs are exactly n*22 tall — the 26px floor below is a list
 *  item's, and applying it here too pushes section 3's trailing line 4px off the export. */
const P = ({ children, className = "", probe }: Block) => (
  <p
    data-probe={probe}
    className={`text-[16px] leading-[22px] text-hd-body-ink ${BREAK} ${className}`}
  >
    {children}
  </p>
);

/** 20px bold black on a 28px leading, 40px clear of whatever precedes it. */
const H2 = ({ children, probe }: Block) => (
  <h2 data-probe={probe} className="text-[20px] font-bold leading-[28px] text-black">
    {children}
  </h2>
);

const List = ({ children, className = "", probe }: Block) => (
  <ul data-probe={probe} className={`list-none space-y-3 ${className}`}>
    {children}
  </ul>
);

const Item = ({ children, probe }: Block) => (
  <li data-probe={probe} className="flex min-h-[26px] items-start">
    <span
      aria-hidden="true"
      className="mx-3 mt-[9.4px] h-[6px] w-[6px] shrink-0 rounded-full bg-hd-eyebrow"
    />
    <span className={`flex-1 text-[16px] leading-[22px] text-hd-body-ink ${BREAK}`}>{children}</span>
  </li>
);

/** A numbered section: the 40px gap above the heading lives here. */
const Article = ({ children, probe }: Block) => (
  <ScrollReveal className="mt-10" amount={0.15} data-probe={probe}>
    {children}
  </ScrollReveal>
);

const PolicyBody = () => {
  const { lang } = useLang();
  const ja = lang === "ja";

  return (
    <section data-nav-theme="light" data-probe="s-policy" className="w-full bg-white">
      <div data-probe="policy-frame" className="mx-auto w-full max-w-[1440px] p-4">
        {/* 102/98 rather than a symmetric 100: the export's first line box sits at y=117 and
            its last ends at 3307, both measured against the card's own 16px inset. */}
        <div
          data-probe="policy-card"
          className="rounded-2xl bg-hd-panel px-6 py-16 sm:px-10 lg:px-0 lg:pb-[98px] lg:pt-[102px]"
        >
          <div data-probe="policy-measure" className="mx-auto w-full max-w-[648px]">
            <ScrollReveal amount={0.15}>
              <P probe="policy-intro">
                {ja
                  ? "UNCHAIN株式会社（以下「当社」といいます。）は、当社が取得する個人情報（個人情報の保護に関する法律（平成十五年法律第五十七号、以下「個人情報保護法」といいます。）にいう「個人情報」を指すものとし、生存する個人に関する情報であって、当該情報に含まれる氏名、生年月日その他の記述等により特定の個人を識別できるもの又は個人識別符号が含まれるものを指します。）の取扱いについて、以下のとおりプライバシーポリシー（以下「本ポリシー」といいます。）を定めます。"
                  : "UNCHAIN Co., Ltd. (hereinafter referred to as “the Company”) hereby establishes this Privacy Policy (hereinafter referred to as “this Policy”) regarding the handling of personal information (as defined under the Act on the Protection of Personal Information (Act No. 57 of 2003, hereinafter referred to as the “Personal Information Protection Act”), meaning information about a living individual that can identify a specific individual by name, date of birth, or other descriptions contained therein, or that includes a personal identification code) acquired by the Company."}
              </P>
            </ScrollReveal>

            {/* 1 */}
            <Article probe="policy-s1">
              <H2 probe="policy-h1">
                {ja
                  ? "1. 個人情報取り扱いに関する基本方針"
                  : "1. Basic Policy on Handling Personal Information"}
              </H2>
              <List className="mt-3" probe="policy-l1">
                <Item probe="policy-l1i1">
                  {ja
                    ? "事業の内容および規模を考慮した適切な個人情報の取得、利用および提供を定めた社内規則を遵守します。"
                    : "We comply with internal rules that define the appropriate collection, use, and provision of personal information in consideration of the nature and scale of our business."}
                </Item>
                <Item>
                  {ja
                    ? "個人情報の漏えい、滅失またはき損の防止措置を講ずると共に、万一の発生時には速やかな是正対策を実施します。"
                    : "We take measures to prevent the leakage, loss, or damage of personal information, and in the event of such an occurrence, we will promptly implement corrective measures."}
                </Item>
                <Item>
                  {ja
                    ? "個人情報の取扱いに関する法令、国が定める指針その他の規範を遵守します。"
                    : "We comply with laws, government guidelines, and other standards relating to the handling of personal information."}
                </Item>
                <Item>
                  {ja
                    ? "お客様からの個人情報に関する苦情および相談に、誠実かつ迅速に対応します。"
                    : "We respond sincerely and promptly to complaints and inquiries from customers regarding personal information."}
                </Item>
                <Item>
                  {ja
                    ? "個人情報管理の仕組みを継続的に改善します。"
                    : "We continuously improve our personal information management systems."}
                </Item>
              </List>
            </Article>

            {/* 2 */}
            <Article probe="policy-s2">
              <H2 probe="policy-h2">{ja ? "2. 個人情報等の取得" : "2. Collection of Personal Information"}</H2>
              <P className="mt-3" probe="policy-b2">
                {ja
                  ? "当社は、個人情報保護法等その他の規範を遵守し、適法かつ公正な手段によってお客様から個人情報等を取得いたします。また、当社は、お客様の個人情報等を取得するときは、個人情報の利用目的等の必要事項について明示した上、当社の事業の範囲内で、その目的の達成に必要な限度において、適切な方法により個人情報等を取得いたします。なお、当社は機微情報を取得いたしません。"
                  : "The Company complies with the Personal Information Protection Act and other standards, and collects personal information from customers through lawful and fair means. When collecting personal information, we clearly state the purpose of use and other necessary matters, and collect personal information by appropriate methods only to the extent necessary to achieve such purposes within the scope of our business. The Company does not collect sensitive information."}
              </P>
            </Article>

            {/* 3 */}
            <Article>
              <H2>{ja ? "3. 個人情報の利用目的" : "3. Purpose of Use of Personal Information"}</H2>
              <P className="mt-3">
                {ja
                  ? "当社は、お客様から個人情報をご提供いただく場合には、お客様から承諾を得た場合又は関係法令等により例外と認められる場合を除き、以下の各号に定める当社事業目的の範囲において利用いたします。"
                  : "When personal information is provided by customers, the Company uses it within the scope of the following business purposes, except where consent has been obtained from the customer or where exceptions are permitted by applicable laws and regulations."}
              </P>
              <List className="mt-3">
                <Item>
                  {ja
                    ? "ご登録またはお申し込みいただいたサービスなどを提供するため（社会的慣習による御通知・御挨拶、サービス提供に必要な関係者との連絡を含みます。）"
                    : "To provide services that have been registered or applied for (including customary notifications and greetings, and communication with relevant parties necessary for service provision)"}
                </Item>
                <Item>
                  {ja
                    ? "展示会、セミナーなどのイベントへのご案内のため"
                    : "To provide information about exhibitions, seminars, and other events"}
                </Item>
                <Item>
                  {ja
                    ? "当社が提供する商品・サービス及びキャンペーン等のご案内（電子メール、チラシ、その他ダイレクトメールの送付を含みます）のため"
                    : "To provide information about products, services, and campaigns offered by the Company (including sending emails, flyers, and other direct mail)"}
                </Item>
                <Item>
                  {ja
                    ? "広告・宣伝等その他マーケティング活動（広告効果の測定を含みます）を行うため"
                    : "To conduct advertising, promotional, and other marketing activities (including measuring advertising effectiveness)"}
                </Item>
                <Item>
                  {ja
                    ? "アンケートやイベントなどにご協力・ご参加いただいた方に結果などを報告するため"
                    : "To report results to those who have cooperated with or participated in surveys, events, etc."}
                </Item>
                <Item>
                  {ja
                    ? "当社商品等の開発等に必要な需要動向、リサーチ情報等、各種情報の提供のため"
                    : "To provide demand trends, research information, and other information necessary for the development of the Company's products"}
                </Item>
                <Item>
                  {ja
                    ? "お客様からのお問い合わせに回答するため"
                    : "To respond to customer inquiries"}
                </Item>
                <Item>{ja ? "法令上の義務を履行するため" : "To fulfill legal obligations"}</Item>
                <Item>
                  {ja
                    ? "当社が利用するシステムの開発及び改善のため"
                    : "To develop and improve systems used by the Company"}
                </Item>
                <Item>
                  {ja
                    ? "その他、お客様との取引を適切かつ円滑に履行するために当社が必要と判断する業務のため"
                    : "For other operations that the Company deems necessary to appropriately and smoothly fulfill transactions with customers"}
                </Item>
                <Item>
                  {ja
                    ? "前各号に附帯関連する目的達成のために必要な範囲で第三者に個人情報を提供するため（なお、ご本人からのお申し出がありましたら、第三者への提供は取り止めさせていただきます。）"
                    : "To provide personal information to third parties to the extent necessary to achieve purposes incidental to the foregoing items (please note that if you request us to do so, we will cease providing your information to third parties)"}
                </Item>
              </List>
              <P className="mt-3">
                {ja
                  ? "なお当社は、お客様との通話を録音することがあります。"
                  : "Please note that the Company may record telephone conversations with customers."}
              </P>
            </Article>

            {/* 4 */}
            <Article>
              <H2>
                {ja ? "4. 個人情報の安全管理" : "4. Security Management of Personal Information"}
              </H2>
              <P className="mt-3">
                {ja
                  ? "当社は、個人情報の紛失、破壊、改ざん及び漏洩などのリスクに対して、個人情報の安全管理が図られるよう、内部規律の整備、組織体制の整備、従業員に対する適切な監督、不正アクセス等の防止などの対策を講じています。"
                  : "The Company takes measures to ensure the secure management of personal information against risks such as loss, destruction, alteration, and leakage, including establishing internal rules, organizing management structures, appropriately supervising employees, and preventing unauthorized access."}
              </P>
            </Article>

            {/* 5 */}
            <Article>
              <H2>
                {ja
                  ? "5. 個人情報の取扱いの委託"
                  : "5. Outsourcing of Personal Information Handling"}
              </H2>
              <P className="mt-3">
                {ja
                  ? "当社は、当社の業務の一部を外部に委託する場合があります。当該業務委託に伴いお客様の個人情報の取扱いの全部または一部を第三者に委託する場合、業務委託先において適切な保護措置が講じられていることを確認し、業務委託先に対して必要かつ適切な監督を行います。"
                  : "The Company may outsource part of its operations to external parties. When outsourcing the handling of customer personal information in whole or in part to a third party in connection with such outsourcing, the Company confirms that appropriate protective measures are in place at the outsourcing partner and exercises necessary and appropriate supervision over such partner."}
              </P>
            </Article>

            {/* 6 */}
            <Article>
              <H2>
                {ja ? "6. 第三者開示及び提供" : "6. Disclosure and Provision to Third Parties"}
              </H2>
              <P className="mt-3">
                {ja
                  ? "当社は、「3. 個人情報の利用目的」「5. 個人情報の取扱いの委託」に規定する場合又は以下のいずれかに該当する場合を除き、お客様の個人情報を第三者へ開示又は提供いたしません。"
                  : "The Company will not disclose or provide customer personal information to third parties except as provided in “3. Purpose of Use of Personal Information” and “5. Outsourcing of Personal Information Handling,” or in any of the following cases."}
              </P>
              <List className="mt-3">
                <Item>{ja ? "お客様の同意がある場合" : "When the customer has given consent"}</Item>
                <Item>{ja ? "法令に基づく場合" : "When required by law"}</Item>
                <Item>
                  {ja
                    ? "人の生命、身体又は財産の保護のため必要な場合であって、お客様の同意を得ることが困難であるとき"
                    : "When necessary for the protection of life, body, or property of an individual and it is difficult to obtain the customer's consent"}
                </Item>
                <Item>
                  {ja
                    ? "公衆衛生の向上又は児童の健全な育成の推進のために特に必要な場合であって、お客様の同意を得ることが困難であるとき"
                    : "When particularly necessary for improving public health or promoting the sound development of children and it is difficult to obtain the customer's consent"}
                </Item>
                <Item>
                  {ja
                    ? "国の機関若しくは地方公共団体又はその委託を受けた者が法令に定める事務を遂行することに対して協力する必要がある場合であって、お客様の同意を得ることにより当該事務の遂行に支障を及ぼすおそれがあるとき"
                    : "When it is necessary to cooperate with a national or local government body or a person entrusted by such body in performing duties prescribed by law, and obtaining the customer's consent may impede the performance of such duties"}
                </Item>
                <Item>
                  {ja
                    ? "合併、会社分割、営業譲渡その他の事由によってお客様の個人情報の提供を含む当社の事業の承継が行われるとき"
                    : "When the Company's business, including the provision of customer personal information, is transferred due to a merger, corporate split, business transfer, or other reason"}
                </Item>
              </List>
            </Article>

            {/* 7 */}
            <Article>
              <H2>
                {ja
                  ? "7. ご登録内容の開示、修正および利用中止"
                  : "7. Disclosure, Correction, and Suspension of Use of Registered Information"}
              </H2>
              <List className="mt-3">
                <Item>
                  {ja
                    ? "当社では、ご本人のお申し出により、個人情報をご本人に開示します。その場合、当社所定の方法によって本人確認を行わせていただきます。ただし、開示することにより次のいずれかに該当する場合は、その全部又は一部を開示しないこともあり、開示しない決定をした場合には、その旨を遅滞なく通知します。ご本人又は第三者の生命、身体、財産その他の権利利益を害するおそれがある場合、当社の業務の適正な実施に著しい支障を及ぼすおそれがある場合、その他法令に違反することとなる場合"
                    : "Upon request by the individual, the Company will disclose personal information to that individual. In such cases, we will verify the identity of the individual by the Company's prescribed method. However, if disclosure falls under any of the following, we may choose not to disclose all or part of the information, and will notify the individual without delay if we decide not to disclose: cases where there is a risk of harm to the life, body, property, or other rights and interests of the individual or a third party; cases where there is a risk of significantly impeding the proper conduct of the Company's business; or cases where disclosure would violate the law."}
                </Item>
                <Item>
                  {ja
                    ? "ご本人に開示した個人情報に事実と異なる内容があった場合、ご本人の請求により、当社ではこれを直ちに修正します。"
                    : "If the personal information disclosed to the individual contains content that differs from the facts, the Company will promptly correct it upon the individual's request."}
                </Item>
                <Item>
                  {ja
                    ? "当社は、ご本人から、個人情報が、利用目的の範囲を超えて取り扱われているという理由、又は不正の手段により取得されたものであるという理由により、その利用の停止又は消去（以下、「利用停止等」といいます。）を求められた場合には、遅滞なく必要な調査を行い、その結果に基づき、個人情報の利用停止等を行い、その旨ご本人に通知します。但し、個人情報の利用停止等に多額の費用を有する場合その他利用停止等を行うことが困難な場合であって、ご本人の権利利益を保護するために必要なこれに代わるべき措置を採れる場合は、この代替策を講じます。"
                    : "If the individual requests the suspension or deletion of use (hereinafter referred to as “suspension of use, etc.”) of personal information on the grounds that it has been handled beyond the scope of the purpose of use or that it was obtained by improper means, the Company will conduct a necessary investigation without delay and, based on the results, will suspend the use of the personal information and notify the individual accordingly. However, if the suspension of use involves significant costs or is otherwise difficult, and alternative measures can be taken to protect the individual's rights and interests, such alternative measures will be implemented."}
                </Item>
              </List>
            </Article>

            {/* 8 */}
            <Article>
              <H2>
                {ja
                  ? "8. 通知・公表、本ポリシーの変更"
                  : "8. Notification, Publication, and Changes to This Policy"}
              </H2>
              <P className="mt-3">
                {ja
                  ? "当社は、本ポリシーを当社ウェブサイト上に掲示、公表しています。当社は、利用者情報の取扱いに関する運用状況を適宜見直し、継続的な改善に努めるものとし、必要に応じて、本ポリシーを変更することがあります。変更した場合には、当社ウェブサイト上に掲載いたします。変更された本ポリシーは、掲載を開始した時点から適用されるものとします。なお、法令上利用者の同意が必要となるような内容の変更の場合は、当社所定の方法で利用者の同意を得るものとします。"
                  : "The Company posts and publishes this Policy on the Company's website. The Company will review the operational status of user information handling as appropriate and strive for continuous improvement, and may change this Policy as necessary. Any changes will be posted on the Company's website. The revised Policy shall take effect from the time it is posted. In the event of changes that require user consent under applicable law, the Company will obtain user consent by its prescribed method."}
              </P>
            </Article>

            {/* 9 */}
            <Article>
              <H2>{ja ? "9. お問い合わせ窓口" : "9. Contact"}</H2>
              <P className="mt-3">
                {ja
                  ? "ご意見、ご質問等のお申出その他利用者情報の取扱いに関するお問い合わせについては、下記の窓口までお願い致します。"
                  : "For any opinions, questions, or other inquiries regarding the handling of user information, please contact the following."}
              </P>
              {/* Two lines rather than one block: the desk name keeps the body's 22px leading
                  (which is what puts it 12px under the paragraph above) and the address
                  follows 2px later, which is where the export's underline lands. */}
              <div className="mt-3">
                <p data-probe="policy-desk" className="text-[16px] leading-[22px] text-black">
                  {ja
                    ? "UNCHAIN株式会社　プライバシーポリシー担当窓口"
                    : "UNCHAIN Co., Ltd. — Privacy Policy Inquiry Desk"}
                </p>
                <p data-probe="policy-mail" className="mt-[2px] text-[16px] leading-[24px] text-hd-body-ink">
                  <a
                    href="mailto:contact@the-unchain.com"
                    className="underline transition-colors hover:text-black"
                  >
                    contact@the-unchain.com
                  </a>
                </p>
              </div>
            </Article>

            {/* 10 */}
            <Article>
              <H2>{ja ? "10. セキュリティ" : "10. Security"}</H2>
              <P className="mt-3">
                {ja
                  ? "当社では、個人情報の管理にあたり相当の注意を尽くしますが、インターネットや電子メールの性質上、個人情報の秘密性を完全に保証することはできません。この点に留意してウェブサイトおよび電子メールをご利用ください。"
                  : "While the Company exercises due care in the management of personal information, due to the nature of the internet and email, we cannot fully guarantee the confidentiality of personal information. Please be aware of this when using our website and email."}
              </P>
            </Article>

            {/* 11 */}
            <Article probe="policy-s11">
              <H2 probe="policy-h11">{ja ? "11. アクセス履歴の取得" : "11. Access Logs"}</H2>
              <P className="mt-3" probe="policy-b11">
                {ja
                  ? "当社ウェブサイトでは、ウェブサイトの保守やサービス改善を目的とし、お客様のアクセス履歴（アクセスログ）を記録しております。"
                  : "The Company's website records customer access history (access logs) for the purpose of website maintenance and service improvement."}
              </P>
            </Article>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PolicyBody;
