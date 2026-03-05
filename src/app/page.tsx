'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Home() {
  const features = [{"icon":"🤖","title":"AI 일정 추천","desc":"팀원들의 캘린더를 분석해 가장 적합한 회의 시간을 자동으로 추천합니다. 복잡한 조율 과정을 AI가 단순화해 드립니다."},{"icon":"🗳️","title":"실시간 투표","desc":"제안된 시간대에 대해 팀원들이 실시간으로 투표하고 의견을 모을 수 있습니다. 합의 과정을 투명하고 빠르게 진행하세요."},{"icon":"📅","title":"캘린더 연동","desc":"Google Calendar, Outlook 등 주요 캘린더와의 원클릭 연동을 지원합니다. 기존 업무 흐름을 방해하지 않습니다."},{"icon":"🔔","title":"스마트 알림","desc":"일정이 확정되면 관련된 모든 팀원에게 자동으로 알림을 발송합니다. 따로 공지를 할 필요가 없습니다."},{"icon":"📊","title":"조율 리포트","desc":"월별/분기별 팀 일정 조율 현황과 효율성 지표를 제공합니다. 팀의 시간 사용 패턴을 인사이트로 확인하세요."},{"icon":"🛡️","title":"엔터프라이즈 보안","desc":"기업 데이터 보안을 최우선으로 합니다. 모든 통신은 암호화되어 안전하게 관리됩니다."}]
  const stats = [{"value":"10,000+","label":"활성 사용자"},{"value":"99.9%","label":"서비스 안정성"},{"value":"50+","label":"기업 고객"},{"value":"24/7","label":"고객 지원"}]
  const steps = [{"step":"1","title":"일정 생성","desc":"회의 또는 회식 일정을 생성하고, 가능한 시간대와 참석자를 설정하세요."},{"step":"2","title":"AI 추천 및 투표","desc":"AI가 최적의 시간을 추천하면, 팀원들이 실시간으로 투표하여 합의합니다."},{"step":"3","title":"확정 및 알림","desc":"가장 많은 표를 받은 시간으로 일정이 확정되고, 모든 참석자에게 자동 알림이 발송됩니다."}]
  const testimonials = [{"content":"매주 팀 회의 시간 정하는 데만 30분 이상 걸렸어요. '되는 시간' 덕분에 이제 5분 만에 끝납니다. 팀원들 모두 만족하고, 불필요한 메신저 알림에서 해방됐네요.","author":"김지훈","role":"프로덕트 매니저","company":"네이버"},{"content":"회식, 워크샵 등 다수 인원 일정 조율이 정말 쉬워졌습니다. AI 추천 기능이 특히 유용해요. 복잡한 조율을 대신해주니 업무 집중도가 눈에 띄게 올랐습니다.","author":"이수진","role":"인사팀장","company":"쿠팡"},{"content":"글로벌 팀과의 회의 시간 조율이 가장 큰 고민이었는데, 시간대 변환과 자동 추천 기능이 해결책이 됐어요. 이제 야근 없이 효율적으로 협업하고 있습니다.","author":"박준호","role":"해외사업부장","company":"삼성전자"}]
  const faqs = [{"q":"서비스 사용을 위해 별도 소프트웨어를 설치해야 하나요?","a":"아니요, 되는 시간은 웹 기반 서비스로 별도 설치 없이 브라우저에서 바로 이용 가능합니다. 모바일 앱도 제공합니다."},{"q":"회사 내부 캘린더(예: Exchange)와도 연동이 가능한가요?","a":"네, Google Calendar, Microsoft Outlook/Exchange를 비롯한 대부분의 엔터프라이즈 캘린더 시스템과의 연동을 지원합니다."},{"q":"무료 체험 기간이 있나요?","a":"14일 무료 체험 기간을 제공합니다. 모든 기능을 제한 없이 사용해 보신 후 결정하실 수 있습니다."},{"q":"데이터 보안은 어떻게 관리되나요?","a":"국제 보안 표준을 준수하며, 모든 데이터는 암호화되어 저장 및 전송됩니다. 개인정보 처리방침을 엄격히 준수합니다."}]
  const trustLogos = ["삼성전자","네이버","카카오","쿠팡"]

  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
      {/* Hero Section */}
      <section className="pt-20 pb-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span
            className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-6"
            style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text-secondary)' }}
          >
            사내 일정 조율 솔루션
          </span>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            회의, 회식 일정 조율
            <br />
            <span style={{ color: 'var(--color-accent)' }}>한 번에 끝내세요</span>
          </h1>
          <p className="text-xl mb-10 max-w-2xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
            번거로운 일정 조율로 낭비되는 팀의 소중한 시간을 되찾아 드립니다.
          </p>
          <div className="flex gap-4 justify-center flex-wrap mb-16">
            <Link
              href="/signup"
              className="px-8 py-4 rounded-xl text-lg font-semibold transition-all hover:scale-105"
              style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
            >
              무료로 시작하기
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 rounded-xl text-lg font-semibold transition-all border"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            >
              로그인
            </Link>
          </div>

          {/* Trust Logos */}
          <div className="pt-8 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>신뢰받는 기업들이 선택했습니다</p>
            <div className="flex justify-center gap-8 flex-wrap">
              {trustLogos.map((logo: string, i: number) => (
                <span key={i} className="text-lg font-semibold opacity-50">{logo}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4" style={{ background: 'var(--color-bg-secondary)' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">숫자로 보는 성과</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat: { value: string; label: string }, i: number) => (
              <div key={i} className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2" style={{ color: 'var(--color-accent)' }}>{stat.value}</div>
                <div style={{ color: 'var(--color-text-secondary)' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              되는 시간의 핵심 기능
            </h2>
            <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>
              AI가 추천하고, 팀원이 투표하는 직관적인 일정 조율 경험
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature: { icon: string; title: string; desc: string }, i: number) => (
              <div
                key={i}
                className="p-8 rounded-2xl transition-all hover:scale-105"
                style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
              >
                <span className="text-5xl mb-6 block">{feature.icon}</span>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p style={{ color: 'var(--color-text-secondary)' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4" style={{ background: 'var(--color-bg-secondary)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">이용 방법</h2>
            <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>
              간단한 3단계로 시작하세요
            </p>
          </div>

          <div className="space-y-8">
            {steps.map((step: { step: string; title: string; desc: string }, i: number) => (
              <div key={i} className="flex items-start gap-6">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0"
                  style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                >
                  {step.step}
                </div>
                <div className="pt-2">
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p style={{ color: 'var(--color-text-secondary)' }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">고객 후기</h2>
            <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>
              실제 사용자들의 이야기
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((item: { content: string; author: string; role: string; company: string }, i: number) => (
              <div
                key={i}
                className="p-8 rounded-2xl"
                style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
              >
                <p className="text-lg mb-6 leading-relaxed">"{item.content}"</p>
                <div>
                  <div className="font-bold">{item.author}</div>
                  <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    {item.role}, {item.company}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4" style={{ background: 'var(--color-bg-secondary)' }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">자주 묻는 질문</h2>

          <div className="space-y-4">
            {faqs.map((faq: { q: string; a: string }, i: number) => (
              <div
                key={i}
                className="rounded-xl overflow-hidden"
                style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-5 text-left font-semibold flex justify-between items-center"
                >
                  {faq.q}
                  <span className="text-2xl">{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5" style={{ color: 'var(--color-text-secondary)' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div
          className="max-w-4xl mx-auto text-center p-12 rounded-3xl"
          style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
        >
          <h2 className="text-4xl font-bold mb-6">당신의 시간을 되찾으세요</h2>
          <p className="text-xl mb-10" style={{ color: 'var(--color-text-secondary)' }}>
            지금 무료로 시작하고, 팀의 소중한 시간을 효율적으로 관리하세요.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/signup"
              className="px-10 py-4 rounded-xl text-lg font-semibold transition-all hover:scale-105"
              style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
            >
              무료로 시작하기
            </Link>
            <Link
              href="/contact"
              className="px-10 py-4 rounded-xl text-lg font-semibold transition-all border"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            >
              문의하기
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4" style={{ borderTop: '1px solid var(--color-border)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4">되는 시간</h3>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                번거로운 일정 조율로 낭비되는 팀의 소중한 시간을 되찾아 드립니다.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">서비스</h4>
              <ul className="space-y-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                <li><Link href="/features" className="hover:underline">기능</Link></li>
                <li><Link href="/pricing" className="hover:underline">가격</Link></li>
                <li><Link href="/docs" className="hover:underline">문서</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">회사</h4>
              <ul className="space-y-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                <li><Link href="/about" className="hover:underline">소개</Link></li>
                <li><Link href="/contact" className="hover:underline">문의</Link></li>
                <li><Link href="/careers" className="hover:underline">채용</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">법적 고지</h4>
              <ul className="space-y-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                <li><Link href="/privacy" className="hover:underline">개인정보처리방침</Link></li>
                <li><Link href="/terms" className="hover:underline">이용약관</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 text-center text-sm" style={{ borderTop: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>
            © {new Date().getFullYear()} 되는 시간. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
