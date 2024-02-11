library IEEE;
use
IEEE.STD_LOGIC_1164.ALL;
use
ieee.std_logic_unsigned.all;
entity main is
Port ( start : in
STD_LOGIC; stop : in
STD_LOGIC; reset : in
STD_LOGIC; clock : in
STD_LOGIC;
output : out STD_LOGIC_VECTOR (7 downto 0));
end main;
architecture Behavioral of main
is constant clock_period : time :=
1 ms; --variable cnt : INTEGER :=
'0'; type state_type is (s0,s1,s2);
signal ps,ns : state_type:=s0;
signal temp : std_logic_vector (7 downto 0) :=
"00000000"; begin
SEQ:process(clock)
begin if
(rising_edge(clock))
then
ps <= ns;
case ps is when
s0 =>
if (start = '1') then
temp <= temp +
"00000001"; output <=
temp; ns <= s1;
end if; if (stop = '1') then
output <= temp; ns
<= ps;
end if; if (reset = '1')
then output <=
temp; ns <= ps;
6
end if;
when s1 =>
if (start
= '1') then
temp <= temp +
"00000001"; output <=
temp; ns <= ps;
end if; if (stop = '1')
then output <=
temp;
ns <= s2;
end if;
if(reset
= '1')then temp
<= "00000000";
output <= temp;
ns <= s0;
end if;
when s2 =>
if (start
= '1') then
temp <= temp +
"00000001"; output <=
temp; ns <= s1;
end if; if (stop = '1')
then output <=
temp; ns <= ps;
end if; if (reset = '1')
then temp <=
"00000000"; output <=
temp; ns <= s0;
end if;
when others =>
null;
end case;
end if;
end process;
end
Behavioral;