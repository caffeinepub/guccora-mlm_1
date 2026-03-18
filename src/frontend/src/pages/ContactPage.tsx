import { Mail, MapPin, Phone, Send } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const labelStyle = {
  display: "block",
  color: "rgba(255,255,255,0.5)",
  fontSize: "12px",
  letterSpacing: "0.06em",
  marginBottom: "6px",
};

const inputStyle = {
  width: "100%",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(212,175,55,0.2)",
  borderRadius: "12px",
  padding: "12px 16px",
  color: "#fff",
  fontSize: "14px",
  outline: "none",
};

export function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Message sent! We'll get back to you within 24 hours.");
      setForm({ name: "", email: "", phone: "", message: "" });
    }, 1200);
  };

  return (
    <div style={{ background: "#0a0a0a", color: "#fff" }}>
      {/* Hero */}
      <section
        className="py-24 text-center"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.07), transparent 60%), #0a0a0a",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl mx-auto px-4"
        >
          <div
            className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full"
            style={{
              background: "rgba(212,175,55,0.08)",
              border: "1px solid rgba(212,175,55,0.2)",
            }}
          >
            <span
              style={{
                color: "#D4AF37",
                fontSize: "11px",
                letterSpacing: "0.15em",
                fontWeight: 600,
              }}
            >
              GET IN TOUCH
            </span>
          </div>
          <h1
            className="font-display font-bold mb-4"
            style={{
              fontSize: "clamp(36px, 6vw, 64px)",
              background:
                "linear-gradient(135deg, #D4AF37, #FFD700 50%, #B8960C)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Contact Us
          </h1>
          <div
            style={{
              width: "80px",
              height: "3px",
              background: "linear-gradient(90deg, #D4AF37, #FFD700)",
              margin: "0 auto 20px",
            }}
          />
          <p
            style={{
              color: "rgba(255,255,255,0.55)",
              fontSize: "17px",
              lineHeight: 1.7,
            }}
          >
            Have questions about joining GUCCORA? We'd love to hear from you.
            Our team responds within 24 hours.
          </p>
        </motion.div>
      </section>

      {/* Content */}
      <section style={{ padding: "60px 0 100px" }}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* Contact Info */}
            <div className="md:col-span-2 space-y-5">
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2
                  className="font-display font-bold text-2xl mb-6"
                  style={{ color: "#D4AF37" }}
                >
                  Reach Us
                </h2>
                {[
                  {
                    icon: Mail,
                    title: "Email",
                    value: "support@guccora.com",
                    sub: "We reply within 24 hours",
                  },
                  {
                    icon: Phone,
                    title: "Phone",
                    value: "+91 98765 43210",
                    sub: "Mon–Sat, 9 AM – 7 PM IST",
                  },
                  {
                    icon: MapPin,
                    title: "Address",
                    value: "GUCCORA HQ",
                    sub: "Mumbai, Maharashtra, India",
                  },
                ].map(({ icon: Icon, title, value, sub }) => (
                  <div
                    key={title}
                    className="flex items-start gap-4 p-5 rounded-2xl"
                    style={{
                      background: "rgba(212,175,55,0.04)",
                      border: "1px solid rgba(212,175,55,0.12)",
                      marginBottom: "12px",
                    }}
                  >
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        background: "rgba(212,175,55,0.1)",
                        border: "1px solid rgba(212,175,55,0.25)",
                      }}
                    >
                      <Icon size={18} style={{ color: "#D4AF37" }} />
                    </div>
                    <div>
                      <div
                        style={{
                          color: "rgba(255,255,255,0.35)",
                          fontSize: "11px",
                          letterSpacing: "0.1em",
                          marginBottom: "2px",
                        }}
                      >
                        {title}
                      </div>
                      <div
                        style={{
                          color: "#fff",
                          fontWeight: 600,
                          fontSize: "14px",
                        }}
                      >
                        {value}
                      </div>
                      <div
                        style={{
                          color: "rgba(255,255,255,0.4)",
                          fontSize: "12px",
                        }}
                      >
                        {sub}
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="md:col-span-3"
            >
              <form
                onSubmit={handleSubmit}
                className="p-8 rounded-2xl"
                style={{
                  background: "rgba(212,175,55,0.04)",
                  border: "1px solid rgba(212,175,55,0.15)",
                }}
              >
                <h2
                  className="font-display font-bold text-2xl mb-6"
                  style={{ color: "#fff" }}
                >
                  Send a Message
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-name" style={labelStyle}>
                        NAME *
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        value={form.name}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, name: e.target.value }))
                        }
                        placeholder="Your full name"
                        style={inputStyle}
                        data-ocid="contact.input"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-email" style={labelStyle}>
                        EMAIL *
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, email: e.target.value }))
                        }
                        placeholder="your@email.com"
                        style={inputStyle}
                        data-ocid="contact.input"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="contact-phone" style={labelStyle}>
                      PHONE
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, phone: e.target.value }))
                      }
                      placeholder="+91 XXXXX XXXXX"
                      style={inputStyle}
                      data-ocid="contact.input"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-message" style={labelStyle}>
                      MESSAGE *
                    </label>
                    <textarea
                      id="contact-message"
                      value={form.message}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, message: e.target.value }))
                      }
                      placeholder="How can we help you?"
                      rows={5}
                      style={{ ...inputStyle, resize: "vertical" }}
                      data-ocid="contact.textarea"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: "100%",
                      background: loading
                        ? "rgba(212,175,55,0.4)"
                        : "linear-gradient(135deg, #D4AF37, #FFD700)",
                      color: "#0a0a0a",
                      border: "none",
                      padding: "13px 0",
                      borderRadius: "24px",
                      fontWeight: 700,
                      fontSize: "15px",
                      cursor: loading ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      transition: "all 0.2s",
                    }}
                    data-ocid="contact.submit_button"
                  >
                    <Send size={16} />
                    {loading ? "Sending..." : "Send Message"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
