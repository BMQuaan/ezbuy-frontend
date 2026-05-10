"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Github,
  CreditCard,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
// import api from "@/lib/api/api";
import { CategoryRef } from "@/features/categories/types";
import { Manufacturer } from "@/features/manufacturers/types";
// import { axiosInstance } from "@/utils/axiosInstance";
import axios from "axios";

type User = {
  fullName: string;
  imageUrl: string | null;
  role: string;
  email: string;
};

export default function Footer() {
  const year = new Date().getFullYear();
  const [categories, setCategories] = useState<CategoryRef[]>([]);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const load = () => {
      const u = localStorage.getItem("user");
      setUser(u ? JSON.parse(u) : null);
    };
    load();
    window.addEventListener("auth:changed", load);
    return () => window.removeEventListener("auth:changed", load);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resCategories, resManufacturers] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`),
          // api.get("/api/categories"),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/manufacturers`),
        ]);

        setCategories(resCategories.data.data.content);
        setManufacturers(resManufacturers.data.data);
      } catch {}
    };

    fetchData();
  }, []);

  if (user && user.role === "ADMIN") return null;

  return (
    <footer className="mt-12 border-t border-border/60 bg-gradient-to-b from-white to-slate-50 text-slate-700">
      {/* Top CTA Strip */}
      <div className="px-4">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-3 items-center justify-between py-4 md:flex-row">
            <div className="text-center md:text-left">
              <p className="text-sm font-medium text-slate-600">Hotline 24/7</p>
              <a
                href="tel:+18001234"
                className="inline-flex items-center gap-2 text-lg font-semibold text-[#0e7cc9]"
              >
                <Phone className="h-4 w-4" /> 01 2345 6789
              </a>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-slate-600">
                Visit our showroom
              </p>
              <p className="inline-flex items-center gap-2 text-slate-700">
                <MapPin className="h-4 w-4" />
                97 Man Thien, Tang Nhon Phu, HCMC
              </p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm font-medium text-slate-600">
                Support Email
              </p>
              <a
                href="mailto:support@ezphone.shop"
                className="inline-flex items-center gap-2 text-slate-700"
              >
                <Mail className="h-4 w-4" />
                support@ezbuy.vn
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="px-4">
        <div className="mx-auto max-w-7xl py-10">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {/* Brand / About */}
            <div className="col-span-1 lg:col-span-2">
              <div className="flex items-center gap-3">
                <div className="relative h-25 w-25 overflow-hidden rounded-xl bg-white shadow-sm">
                  <Image
                    src="/images/logo/ezbuy_logo.png"
                    alt="EZBuy"
                    fill
                    className="object-contain p-1"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold tracking-tight text-slate-900">
                    EZBuy
                  </h3>
                  <p className="text-xs text-slate-500">
                    Smartphones & accessories made easy
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                Discover the latest smartphones, wearables, and audio gear at
                great prices. Fast delivery, secure checkout, and friendly
                support.
              </p>

              {/* Socials */}
              <div className="mt-5 flex items-center gap-3">
                <Social
                  icon={<Facebook className="h-4 w-4" />}
                  href="#"
                  label="Facebook"
                />
                <Social
                  icon={<Instagram className="h-4 w-4" />}
                  href="#"
                  label="Instagram"
                />
                <Social
                  icon={<Youtube className="h-4 w-4" />}
                  href="#"
                  label="YouTube"
                />
                <Social
                  icon={<Twitter className="h-4 w-4" />}
                  href="#"
                  label="Twitter"
                />
                <Social
                  icon={<Github className="h-4 w-4" />}
                  href="#"
                  label="GitHub"
                />
              </div>

              {/* Payments */}
              <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <CreditCard className="h-4 w-4" />
                <span>COD</span>
                {/* <span>•</span>
                <span>Mastercard</span>
                <span>•</span>
                <span>PayPal</span>
                <span>•</span>
                <span>MoMo</span>
                <span>•</span>
                <span>ZaloPay</span> */}
              </div>
            </div>

            {/* Quick Links */}
            <FooterCol title="Quick Links">
              <FooterLink href="/about">About us</FooterLink>
              <FooterLink href="/contact">Contact</FooterLink>
              <FooterLink href="/about#products">
                Products & Services
              </FooterLink>
              <FooterLink href="/about#values">Core Values</FooterLink>
              <FooterLink href="/about#future_direction">
                Future Direction
              </FooterLink>
            </FooterCol>

            {/* Categories */}
            <FooterCol title="Categories">
              <div className="flex max-h-40 flex-col gap-2 overflow-auto pr-1">
                {categories.length === 0 ? (
                  <span className="text-sm text-slate-500">No categories</span>
                ) : (
                  categories.map((c) => (
                    <FooterLink key={c.id} href={`/categories/${String(c.id)}`}>
                      {c.name}
                    </FooterLink>
                  ))
                )}
              </div>
            </FooterCol>

            {/* Manufacturers */}
            <FooterCol title="Manufacturers">
              <div className="flex max-h-40 flex-col gap-2 overflow-auto pr-1">
                {manufacturers.length === 0 ? (
                  <span className="text-sm text-slate-500">
                    No manufacturers
                  </span>
                ) : (
                  manufacturers.slice(0, 5).map((m) => (
                    <FooterLink key={m.id} href={``}>
                      {m.name}
                    </FooterLink>
                  ))
                )}
              </div>
            </FooterCol>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border/60 bg-white/50">
        <div className="mx-auto max-w-7xl px-4 py-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-slate-500">
            © {year} EZBuy. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
            <div className="inline-flex items-center gap-1">
              <ShieldCheck className="h-4 w-4" /> Secure checkout
            </div>
            <Link className="hover:text-slate-700" href="/policies/privacy">
              Privacy
            </Link>
            <Link className="hover:text-slate-700" href="/policies/terms">
              Terms
            </Link>
            <Link className="hover:text-slate-700" href="/sitemap">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="text-sm font-semibold tracking-wide text-slate-900">
        {title}
      </h4>
      <div className="mt-4 flex flex-col gap-2">{children}</div>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-sm text-slate-600 hover:text-[#0e7cc9] hover:underline underline-offset-4"
    >
      {children}
    </Link>
  );
}

function Social({
  icon,
  href,
  label,
}: {
  icon: React.ReactNode;
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-[#0e7cc9] hover:border-[#0e7cc9]/30"
    >
      {icon}
    </Link>
  );
}
