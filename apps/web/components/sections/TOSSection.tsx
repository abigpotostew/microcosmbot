// SPDX-License-Identifier: GPL-3.0-or-later

import { Icon } from 'components/Icon'
import { useRouter } from 'next/router'

const TOSSection: React.FC = () => {
  const router = useRouter()
  const handleBack = () => router.back()

  return (
    <section className="relative pb-10 xl:pb-24">
      <header className="relative z-50 bg-olive-200 pt-16 pb-8 lg:pb-9">
        <div className="container px-6">
          <div className="flex flex-col items-start gap-4">
            <h1 className="text-title2">Terms of Service</h1>
            <button
              onClick={handleBack}
              className="text-body1 inline-flex items-center gap-3 group"
            >
              <Icon
                icon="arrow"
                classes="w-5 h-5 origin-center shrink-0 fill-gray-900 rotate-180 transition-transform group-hover:-translate-x-1"
                color="inherit"
              />
              Back
            </button>
          </div>
        </div>
      </header>
      <div className="container flex flex-col items-start gap-6 pt-22 px-6">
        <p className="text-body1">
          These Terms of Service (“Terms”) constitute a legally binding
          agreement made between you, whether personally or on behalf of an
          entity (“you”) and Wardenclyffe Labs Inc. (“Company“, “we”, “us”,
          “Nouns Stream“, or “our”, and together with “you”, the “Parties” and
          each individually, a “Party”), concerning your access to and use of
          the nouns.stream and docs.nouns.stream websites as well as any other
          media form, media channel, mobile website or mobile application
          related, linked, or otherwise connected thereto (collectively, the
          “Site”).
        </p>
        <p className="text-body1">
          Nouns.stream is a website-hosted user interface (the “Interface“ or
          “App“) provided by Wardenclyffe Labs Inc. (“we“, “our“, or “us“). The
          Interface provides access to a decentralized protocol on the
          blockchain that allows users to create and interact with smart
          contracts (“the Nouns Stream Protocol“ or the “Protocol“). The
          Interface is one, but not the exclusive, means of accessing the
          Protocol.
        </p>
        <p className="text-body1">
          This Terms of Service Agreement (the “Agreement“) explains the terms
          and conditions by which you may access and use the Interface. You must
          read this Agreement carefully. By accessing or using the Interface,
          you signify that you have read, understand, and agree to be bound by
          this Agreement in its entirety. If you do not agree, you are not
          authorized to access or use the Interface and should not use the
          Interface.
        </p>
        <ol className="list-decimal list-inside">
          <li className="text-title3 mb-7">
            <h2 className="inline-block text-title3 mb-5">
              Modification of this Agreement
            </h2>
            <p className="text-body1">
              We reserve the right, in our sole discretion, to modify this
              Agreement from time to time. If we make any modifications, we will
              post the changes or modifications on this page and will indicate
              at the top of this page the date these Terms were last revised. We
              will also notify you of the changes or modifications, either
              through the Interface or through other reasonable means. All
              modifications will be effective when they are posted, and your
              continued accessing or use of the Interface will serve as
              confirmation of your acceptance of those modifications. If you do
              not agree with any modifications to this Agreement, you must
              immediately stop accessing and using the Interface.
            </p>
          </li>
          <li className="text-title3">
            <h2 className="inline-block text-title3 mb-5">Eligibility</h2>
            <p className="text-body1">
              To access or use the Interface, you must be able to form a legally
              binding contract with us. Accordingly, you represent that you are
              at least the age of majority in your jurisdiction (e.g., eighteen
              years old) and have the full right, power, and authority to enter
              into and comply with the terms and conditions of this Agreement on
              behalf of yourself and any company or legal entity for which you
              may access or use the Interface.
            </p>
          </li>
        </ol>
        <p className="text-body1">
          You further represent that you are not (a) the subject of economic or
          trade sanctions administered or enforced by any governmental authority
          or otherwise designated on any list of prohibited or restricted
          parties (including but not limited to the list maintained by the
          Office of Foreign Assets Control of the U.S. Department of the
          Treasury) or (b) a citizen, resident, or organized in a jurisdiction
          or territory that is the subject of comprehensive country-wide,
          territory-wide, or regional economic sanctions by the United States.
          Finally, you represent that your access and use of the Interface will
          fully comply with all applicable laws and regulations, and that you
          will not access or use the Interface to conduct, promote, or otherwise
          facilitate any illegal activity.
        </p>
        <ol className="list-decimal list-inside">
          <li className="text-title3 mb-7">
            <h2 className="inline-block text-title3 mb-5">
              Proprietary Rights
            </h2>
            <p className="text-body1">
              We own all intellectual property and other rights in the Interface
              and its contents, including (but not limited to) software, text,
              images, trademarks, service marks, copyrights, patents, and
              designs. This intellectual property is available under the terms
              of our copyright licenses. Unlike the Interface, the Nouns Stream
              protocol is comprised entirely of open-source or source-available
              software running on the multiple public blockchains namely
              Ethereum, Polygon, Optimism, Base and Arbitrum.
            </p>
          </li>
          <li className="text-title3 mb-7">
            <h2 className="inline-block text-title3 mb-5">Additional Rights</h2>
            <p className="text-body1">
              We reserve the following rights, which do not constitute
              obligations of ours: (a) with or without notice to you, to modify,
              substitute, eliminate or add to the Interface; (b) to review,
              modify, filter, disable, delete and remove any and all content and
              information from the Interface; and (c) to cooperate with any law
              enforcement, court or government investigation or order or third
              party requesting or directing that we disclose information or
              content or information that you provide.
            </p>
          </li>
          <li className="text-title3 mb-7">
            <h2 className="inline-block text-title3 mb-5">Privacy</h2>
            <p className="text-body1 mb-5">
              We do not collect any personal information from you (e.g., your
              name or other identifiers that can be linked to you). We do,
              however, use third-party service providers, like Alchemy, Sentry,
              and, Fathom Analytics, which may receive or independently obtain
              your personal information from publicly-available sources. We do
              not control how these third parties handle your data and you
              should review their privacy policies to understand how they
              collect, use, and share your personal information. By accessing
              and using the Interface, you understand and consent to our data
              practices and our service providers“ treatment of your
              information.
            </p>
            <p className="text-body1 mb-5">
              We use the information we collect to detect, prevent, and mitigate
              financial crime and other illicit or harmful activities on the
              Interface. For these purposes, we may share the information we
              collect with blockchain analytics providers. We share information
              with these service providers only so that they can help us promote
              the safety, security, and integrity of the Interface. We do not
              retain the information we collect any longer than necessary for
              these purposes.
            </p>
            <p className="text-body1">
              Please note that when you use the Interface, you are interacting
              with the Ethereum, Polygon, Optimism, Arbitrum or Base blockchain,
              where each provides transparency into your transactions.
              Wardenclyffe Labs Inc. does not control and is not responsible for
              any information you make public on the aforementioned blockchains
              by taking actions through the Interface.
            </p>
          </li>
          <li className="text-title3 mb-7">
            <h2 className="inline-block text-title3 mb-5">
              Prohibited Activity
            </h2>
            <p className="text-body1 mb-5">
              You agree not to engage in, or attempt to engage in, any of the
              following categories of prohibited activity in relation to your
              access and use of the Interface:
            </p>
            <ul className="list-disc list-inside">
              <li className="text-body1 mb-5">
                Intellectual Property Infringement. Activity that infringes on
                or violates any copyright, trademark, service mark, patent,
                right of publicity, right of privacy, or other proprietary or
                intellectual property rights under the law.
              </li>
              <li className="text-body1 mb-5">
                Cyberattack. Activity that seeks to interfere with or compromise
                the integrity, security, or proper functioning of any computer,
                server, network, personal device, or other information
                technology system, including (but not limited to) the deployment
                of viruses and denial of service attacks.
              </li>
              <li className="text-body1 mb-5">
                Fraud and Misrepresentation. Activity that seeks to defraud us
                or any other person or entity, including (but not limited to)
                providing any false, inaccurate, or misleading information in
                order to unlawfully obtain the property of another.
              </li>
              <li className="text-body1 mb-5">
                Market Manipulation. Activity that violates any applicable law,
                rule, or regulation concerning the integrity of trading markets,
                including (but not limited to) the manipulative tactics commonly
                known as spoofing and wash trading.
              </li>
              <li className="text-body1 mb-5">
                Securities and Derivatives Violations. Activity that violates
                any applicable law, rule, or regulation concerning the trading
                of securities or derivatives.
              </li>
              <li className="text-body1 mb-5">
                Any Other Unlawful Conduct. Activity that violates any
                applicable law, rule, or regulation of the United States or
                another relevant jurisdiction, including (but not limited to)
                the restrictions and regulatory requirements imposed by U.S.
                law.
              </li>
            </ul>
          </li>
          <li className="text-title3 mb-7">
            <h2 className="inline-block text-title3 mb-5">
              Not Registered with the SEC or Any Other Agency
            </h2>
            <p className="text-body1">
              We are not registered with the U.S. Securities and Exchange
              Commission as a national securities exchange or in any other
              capacity.
            </p>
          </li>
          <li className="text-title3 mb-7">
            <h2 className="inline-block text-title3 mb-5">No Warranties</h2>
            <p className="text-body1">
              The Interface is provided on an “AS IS“ and “AS AVAILABLE“ basis.
              To the fullest extent permitted by law, we disclaim any
              representations and warranties of any kind, whether express,
              implied, or statutory, including (but not limited to) the
              warranties of merchantability and fitness for a particular
              purpose. You acknowledge and agree that your use of the Interface
              is at your own risk. We do not represent or warrant that access to
              the Interface will be continuous, uninterrupted, timely, or
              secure; that the information contained in the Interface will be
              accurate, reliable, complete, or current; or that the Interface
              will be free from errors, defects, viruses, or other harmful
              elements. No advice, information, or statement that we make should
              be treated as creating any warranty concerning the Interface. We
              do not endorse, guarantee, or assume responsibility for any
              advertisements, offers, or statements made by third parties
              concerning the Interface.
            </p>
          </li>
          <li className="text-title3 mb-7">
            <h2 className="inline-block text-title3 mb-5">
              Non-Custodial and No Fiduciary Duties
            </h2>
            <p className="text-body1">
              The Interface is a purely non-custodial application, meaning you
              are solely responsible for the custody of the cryptographic
              private keys to the digital asset wallets you hold. This Agreement
              is not intended to, and does not, create or impose any fiduciary
              duties on us. To the fullest extent permitted by law, you
              acknowledge and agree that we owe no fiduciary duties or
              liabilities to you or any other party, and that to the extent any
              such duties or liabilities may exist at law or in equity, those
              duties and liabilities are hereby irrevocably disclaimed, waived,
              and eliminated. You further agree that the only duties and
              obligations that we owe you are those set out expressly in this
              Agreement.
            </p>
          </li>
          <li className="text-title3 mb-7">
            <h2 className="inline-block text-title3 mb-5">
              Compliance Obligations
            </h2>
            <p className="text-body1">
              The Interface is operated from facilities within the United
              States. The Interface may not be available or appropriate for use
              in other jurisdictions. By accessing or using the Interface, you
              agree that you are solely and entirely responsible for compliance
              with all laws and regulations that may apply to you.
            </p>
          </li>
          <li className="text-title3 mb-7">
            <h2 className="inline-block text-title3 mb-5">
              Assumption of Risk
            </h2>
            <p className="text-body1">
              You further understand that the markets for these digital assets
              are highly volatile due to factors including (but not limited to)
              adoption, speculation, technology, security, and regulation. You
              acknowledge and accept that the cost and speed of transacting with
              cryptographic and blockchain-based systems such as Ethereum are
              variable and may increase dramatically at any time. You further
              acknowledge and accept the risk that your digital assets may lose
              some or all of their value while they are supplied to the Protocol
              through the Interface. You understand that anyone can create a
              token, including fake versions of existing tokens and tokens that
              falsely claim to represent projects, and acknowledge and accept
              the risk that you may mistakenly interact with those or other
              tokens. You further acknowledge that we are not responsible for
              any of these variables or risks, do not own or control the
              Protocol, and cannot be held liable for any resulting losses that
              you experience while accessing or using the Interface.
              Accordingly, you understand and agree to assume full
              responsibility for all of the risks of accessing and using the
              Interface to interact with the Protocol.
            </p>
          </li>
          <li className="text-title3 mb-7">
            <h2 className="inline-block text-title3 mb-5">
              Third-Party Resources and Promotions
            </h2>
            <p className="text-body1">
              The Interface may contain references or links to third-party
              resources, including (but not limited to) information, materials,
              products, or services, that we do not own or control. In addition,
              third parties may offer promotions related to your access and use
              of the Interface. We do not endorse or assume any responsibility
              for any such resources or promotions. If you access any such
              resources or participate in any such promotions, you do so at your
              own risk, and you understand that this Agreement does not apply to
              your dealings or relationships with any third parties. You
              expressly relieve us of any and all liability arising from your
              use of any such resources or participation in any such promotions.
            </p>
          </li>
          <li className="text-title3 mb-7">
            <h2 className="inline-block text-title3 mb-5">Release of Claims</h2>
            <p className="text-body1">
              You expressly agree that you assume all risks in connection with
              your access and use of the Interface and your interaction with the
              Protocol. You further expressly waive and release us from any and
              all liability, claims, causes of action, or damages arising from
              or in any way relating to your use of the Interface and your
              interaction with the Protocol. If you are a California resident,
              you waive the benefits and protections of California Civil Code §
              1542, which provides: “[a] general release does not extend to
              claims that the creditor or releasing party does not know or
              suspect to exist in his or her favor at the time of executing the
              release and that, if known by him or her, would have materially
              affected his or her settlement with the debtor or released party.“
            </p>
          </li>
          <li className="text-title3 mb-7">
            <h2 className="inline-block text-title3 mb-5">Indemnity</h2>
            <p className="text-body1">
              You agree to hold harmless, release, defend, and indemnify us and
              our officers, directors, employees, contractors, agents,
              affiliates, and subsidiaries from and against all claims, damages,
              obligations, losses, liabilities, costs, and expenses arising
              from: (a) your access and use of the Interface; (b) your violation
              of any term or condition of this Agreement, the right of any third
              party, or any other applicable law, rule, or regulation; and (c)
              any other party`s access and use of the Interface with your
              assistance or using any device or account that you own or control.
            </p>
          </li>
          <li className="text-title3 mb-7">
            <h2 className="inline-block text-title3 mb-5">
              Limitation of Liability
            </h2>
            <p className="text-body1">
              Under no circumstances shall we or any of our officers, directors,
              employees, contractors, agents, affiliates, or subsidiaries be
              liable to you for any indirect, punitive, incidental, special,
              consequential, or exemplary damages, including (but not limited
              to) damages for loss of profits, goodwill, use, data, or other
              intangible property, arising out of or relating to any access or
              use of the Interface, nor will we be responsible for any damage,
              loss, or injury resulting from hacking, tampering, or other
              unauthorized access or use of the Interface or the information
              contained within it. We assume no liability or responsibility for
              any: (a) errors, mistakes, or inaccuracies of content; (b)
              personal injury or property damage, of any nature whatsoever,
              resulting from any access or use of the Interface; (c)
              unauthorized access or use of any secure server or database in our
              control, or the use of any information or data stored therein; (d)
              interruption or cessation of function related to the Interface;
              (e) bugs, viruses, trojan horses, or the like that may be
              transmitted to or through the Interface; (f) errors or omissions
              in, or loss or damage incurred as a result of the use of, any
              content made available through the Interface; and (g) the
              defamatory, offensive, or illegal conduct of any third party.
              Under no circumstances shall we or any of our officers, directors,
              employees, contractors, agents, affiliates, or subsidiaries be
              liable to you for any claims, proceedings, liabilities,
              obligations, damages, losses, or costs in an amount exceeding the
              amount you paid to us in exchange for access to and use of the
              Interface, or USD$100.00, whichever is greater. This limitation of
              liability applies regardless of whether the alleged liability is
              based on contract, tort, negligence, strict liability, or any
              other basis, and even if we have been advised of the possibility
              of such liability. Some jurisdictions do not allow the exclusion
              of certain warranties or the limitation or exclusion of certain
              liabilities and damages. Accordingly, some of the disclaimers and
              limitations set forth in this Agreement may not apply to you. This
              limitation of liability shall apply to the fullest extent
              permitted by law.
            </p>
          </li>
          <li className="text-title3 mb-7">
            <h2 className="inline-block text-title3 mb-5">
              Dispute Resolution
            </h2>
            <p className="text-body1">
              We will use our best efforts to resolve any potential disputes
              through informal, good faith negotiations. If a potential dispute
              arises, you must contact us by sending an email to
              devs@nouns.stream so that we can attempt to resolve it without
              resorting to formal dispute resolution. If we aren`t able to reach
              an informal resolution within sixty days of your email, then you
              and we both agree to resolve the potential dispute according to
              the process set forth below.
            </p>
            <p className="text-body1">
              Any claim or controversy arising out of or relating to the
              Interface, this Agreement, or any other acts or omissions for
              which you may contend that we are liable, including (but not
              limited to) any claim or controversy as to arbitrability
              (“Dispute“), shall be finally and exclusively settled by
              arbitration under the JAMS Optional Expedited Arbitration
              Procedures. You understand that you are required to resolve all
              Disputes by binding arbitration. The arbitration shall be held on
              a confidential basis before a single arbitrator, who shall be
              selected pursuant to JAMS rules. The arbitration will be held in
              San Francisco, California, unless you and we both agree to hold it
              elsewhere. Unless we agree otherwise, the arbitrator may not
              consolidate your claims with those of any other party. Any
              judgment on the award rendered by the arbitrator may be entered in
              any court of competent jurisdiction.
            </p>
          </li>
          <li className="text-title3 mb-7">
            <h2 className="inline-block text-title3 mb-5">
              Class Action and Jury Trial Waiver
            </h2>
            <p className="text-body1">
              You must bring any and all Disputes against us in your individual
              capacity and not as a plaintiff in or member of any purported
              class action, collective action, private attorney general action,
              or other representative proceeding. This provision applies to
              class arbitration. You and we both agree to waive the right to
              demand a trial by jury.
            </p>
          </li>
          <li className="text-title3 mb-7">
            <h2 className="inline-block text-title3 mb-5">Governing Law</h2>
            <p className="text-body1">
              You agree that the laws of the State of California, without regard
              to principles of conflict of laws, govern this Agreement and any
              Dispute between you and us. You further agree that the Interface
              shall be deemed to be based solely in the State of California, and
              that although the Interface may be available in other
              jurisdictions, its availability does not give rise to general or
              specific personal jurisdiction in any forum outside the State of
              California. Any arbitration conducted pursuant to this Agreement
              shall be governed by the Federal Arbitration Act. You agree that
              the federal and state courts of San Francisco County, California
              are the proper forum for any appeals of an arbitration award or
              for court proceedings in the event that this Agreement`s binding
              arbitration clause is found to be unenforceable.
            </p>
          </li>
          <li className="text-title3 mb-7">
            <h2 className="inline-block text-title3 mb-5">Entire Agreement</h2>
            <p className="text-body1">
              These terms constitute the entire agreement between you and us
              with respect to the subject matter hereof. This Agreement
              supersedes any and all prior or contemporaneous written and oral
              agreements, communications and other understandings (if any)
              relating to the subject matter of the terms.
            </p>
          </li>
        </ol>
      </div>
    </section>
  )
}

export default TOSSection
