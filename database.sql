--
-- PostgreSQL database dump
--

\restrict 2Mp0Scc1xnwy7Xc35Q95pVGMbZWrPhgmH2YfuhuRtFv9PldUF55iTewWuGNesnX

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'WIN1252';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: FotoSampah; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."FotoSampah" (
    id text NOT NULL,
    "laporanId" text NOT NULL,
    url text NOT NULL
);


ALTER TABLE public."FotoSampah" OWNER TO postgres;

--
-- Name: JenisSampah; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."JenisSampah" (
    id text NOT NULL,
    "namaJenis" text NOT NULL
);


ALTER TABLE public."JenisSampah" OWNER TO postgres;

--
-- Name: LaporanSampah; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."LaporanSampah" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "jenisSampahId" text NOT NULL,
    "wilayahId" text NOT NULL,
    deskripsi text NOT NULL,
    status text DEFAULT 'PENDING'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."LaporanSampah" OWNER TO postgres;

--
-- Name: Tag; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Tag" (
    id text NOT NULL,
    "namaTag" text NOT NULL
);


ALTER TABLE public."Tag" OWNER TO postgres;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id text NOT NULL,
    nama text NOT NULL,
    email text NOT NULL,
    "noHp" text NOT NULL,
    password text NOT NULL,
    role text DEFAULT 'USER'::text NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: Wilayah; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Wilayah" (
    id text NOT NULL,
    "namaWilayah" text NOT NULL
);


ALTER TABLE public."Wilayah" OWNER TO postgres;

--
-- Name: _LaporanToTag; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_LaporanToTag" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_LaporanToTag" OWNER TO postgres;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Data for Name: FotoSampah; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."FotoSampah" (id, "laporanId", url) FROM stdin;
df17a42e-79b5-4af1-b011-5d0bd03425fa	b3ee2c6d-bf72-455c-b27c-abc8c4127a03	https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&q=80&w=400
\.


--
-- Data for Name: JenisSampah; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."JenisSampah" (id, "namaJenis") FROM stdin;
45c06ba9-b75b-40b1-93f0-21a7a1abc691	Sampah Organik
14f60236-0a08-4baa-a0a8-027171bb6d21	Sampah Anorganik
8901bc50-ad87-4fab-a1c3-88e296599680	Sampah B3
7a423640-d666-442c-b4c8-d40e024a2e78	Sampah Kertas
ec91b84a-90da-4598-b517-96fabed1ae6f	Sampah Plastik
\.


--
-- Data for Name: LaporanSampah; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."LaporanSampah" (id, "userId", "jenisSampahId", "wilayahId", deskripsi, status, "createdAt") FROM stdin;
b3ee2c6d-bf72-455c-b27c-abc8c4127a03	5f3a0236-162b-42a0-9046-c4477ecb8f1c	45c06ba9-b75b-40b1-93f0-21a7a1abc691	453a3a14-127f-41d7-a8c4-a5d09f4245c6	Tumpukan sampah plastik dan limbah dapur menumpuk di gang masuk. Mengeluarkan bau menyengat.	PENDING	2026-08-24 08:44:14.147
\.


--
-- Data for Name: Tag; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Tag" (id, "namaTag") FROM stdin;
1f803f70-fd55-4dfa-b649-46305c05a5a3	Bau Menyengat
c89d2ee8-518f-48d5-857a-3298d58d955e	Menghalangi Jalan
109d5d24-6e29-411f-acf8-4e293c3f7c0d	Limbah Beracun
adec9f8e-fb9d-44ba-ae54-67b2dfa0f62e	Sampah Plastik Dominan
b27e8f4d-ce39-45a8-871a-11646ebc0f20	Butuh Penanganan Segera
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, nama, email, "noHp", password, role) FROM stdin;
b2eab03c-bcc0-4026-8f9d-ee80d5501e4c	Admin Web Sampah	admin@websampah.com	081234567890	240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9	ADMIN
5f3a0236-162b-42a0-9046-c4477ecb8f1c	Budi Santoso	user@websampah.com	089876543210	e606e38b0d8c19b24cf0ee3808183162ea7cd63ff7912dbb22b5e803286b4446	USER
0814b769-050d-4679-9029-fad16af3d6ea	nama	nama@gmail.com	08177998	ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f	USER
\.


--
-- Data for Name: Wilayah; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Wilayah" (id, "namaWilayah") FROM stdin;
453a3a14-127f-41d7-a8c4-a5d09f4245c6	Jakarta Pusat
fd224bc4-2cc1-4096-b75c-b38a57e9adb7	Jakarta Selatan
6315f023-6549-496e-818e-b43436cefe51	Jakarta Barat
f7c2781f-b064-4f37-9e99-617603d8fd69	Jakarta Timur
5eaf2ac0-fae3-4fad-bb26-251a5561141c	Jakarta Utara
7647b810-4e51-4b4d-a94c-3aab1e147027	Bandung
b1a7f4c8-807f-4f24-be33-a1ccc6e3fe69	Surabaya
\.


--
-- Data for Name: _LaporanToTag; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_LaporanToTag" ("A", "B") FROM stdin;
b3ee2c6d-bf72-455c-b27c-abc8c4127a03	1f803f70-fd55-4dfa-b649-46305c05a5a3
b3ee2c6d-bf72-455c-b27c-abc8c4127a03	109d5d24-6e29-411f-acf8-4e293c3f7c0d
b3ee2c6d-bf72-455c-b27c-abc8c4127a03	adec9f8e-fb9d-44ba-ae54-67b2dfa0f62e
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
85f9b4c3-0677-42e6-b256-790376925352	134cdab015cebf50548874daac0765c9a4e73dc65541a52e03fa45ab457d993f	2026-08-10 18:55:24.786873+07	20260810115524_init	\N	\N	2026-08-10 18:55:24.692564+07	1
6673d113-ff47-45bc-b934-fad9078a9de5	c3bcd074912d36693afb0136e15f7f4c94e2afe9da01dcd29b0b20957e9489c9	2026-08-24 15:40:33.097759+07	20260824084033_add_tags	\N	\N	2026-08-24 15:40:33.04527+07	1
\.


--
-- Name: FotoSampah FotoSampah_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FotoSampah"
    ADD CONSTRAINT "FotoSampah_pkey" PRIMARY KEY (id);


--
-- Name: JenisSampah JenisSampah_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JenisSampah"
    ADD CONSTRAINT "JenisSampah_pkey" PRIMARY KEY (id);


--
-- Name: LaporanSampah LaporanSampah_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LaporanSampah"
    ADD CONSTRAINT "LaporanSampah_pkey" PRIMARY KEY (id);


--
-- Name: Tag Tag_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Tag"
    ADD CONSTRAINT "Tag_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: Wilayah Wilayah_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Wilayah"
    ADD CONSTRAINT "Wilayah_pkey" PRIMARY KEY (id);


--
-- Name: _LaporanToTag _LaporanToTag_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_LaporanToTag"
    ADD CONSTRAINT "_LaporanToTag_AB_pkey" PRIMARY KEY ("A", "B");


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: FotoSampah_laporanId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "FotoSampah_laporanId_key" ON public."FotoSampah" USING btree ("laporanId");


--
-- Name: JenisSampah_namaJenis_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "JenisSampah_namaJenis_key" ON public."JenisSampah" USING btree ("namaJenis");


--
-- Name: Tag_namaTag_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Tag_namaTag_key" ON public."Tag" USING btree ("namaTag");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_noHp_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_noHp_key" ON public."User" USING btree ("noHp");


--
-- Name: Wilayah_namaWilayah_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Wilayah_namaWilayah_key" ON public."Wilayah" USING btree ("namaWilayah");


--
-- Name: _LaporanToTag_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_LaporanToTag_B_index" ON public."_LaporanToTag" USING btree ("B");


--
-- Name: FotoSampah FotoSampah_laporanId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FotoSampah"
    ADD CONSTRAINT "FotoSampah_laporanId_fkey" FOREIGN KEY ("laporanId") REFERENCES public."LaporanSampah"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LaporanSampah LaporanSampah_jenisSampahId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LaporanSampah"
    ADD CONSTRAINT "LaporanSampah_jenisSampahId_fkey" FOREIGN KEY ("jenisSampahId") REFERENCES public."JenisSampah"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LaporanSampah LaporanSampah_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LaporanSampah"
    ADD CONSTRAINT "LaporanSampah_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LaporanSampah LaporanSampah_wilayahId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LaporanSampah"
    ADD CONSTRAINT "LaporanSampah_wilayahId_fkey" FOREIGN KEY ("wilayahId") REFERENCES public."Wilayah"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: _LaporanToTag _LaporanToTag_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_LaporanToTag"
    ADD CONSTRAINT "_LaporanToTag_A_fkey" FOREIGN KEY ("A") REFERENCES public."LaporanSampah"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _LaporanToTag _LaporanToTag_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_LaporanToTag"
    ADD CONSTRAINT "_LaporanToTag_B_fkey" FOREIGN KEY ("B") REFERENCES public."Tag"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict 2Mp0Scc1xnwy7Xc35Q95pVGMbZWrPhgmH2YfuhuRtFv9PldUF55iTewWuGNesnX

